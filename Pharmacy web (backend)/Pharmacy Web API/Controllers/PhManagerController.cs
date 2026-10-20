using DTOs.ManagerDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using DTOs.PersonDTOs;
using DTOs.RequestDTOs;
using DTOs.ReqestDTOs;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Http.Metadata;
using DTOs.CustomerDTOs;
using DatabaseLayer.Entities;
using DTOs.RequestDTOs.Refund;
using Newtonsoft.Json.Linq;
using DTOs.AdminDTOs;
using DTOs.ResultDTOs;

namespace Pharmacy_Web_API.Controllers
{
    [Route("api/v1/ph-manager")]
    [ApiController]
    public class PhManagerController : ControllerBase
    {
        private readonly TokenServices _tokenServices;
        private readonly ManagerServices _managerServices;
        private readonly EmailVerficationService _emailVerficationService;
        private readonly PersonServices _personServices;
        private readonly FileUploadService _fileUploadService;
        private readonly AdminService _adminService;

        public PhManagerController(TokenServices tokenServices, ManagerServices managerServices,
            EmailVerficationService emailVerficationService, PersonServices personServices, FileUploadService fileUploadService, AdminService adminService)
        {
            _tokenServices = tokenServices;
            _managerServices = managerServices;
            _emailVerficationService = emailVerficationService;
            _personServices = personServices;
            _fileUploadService = fileUploadService;
            _adminService = adminService;
        }

        [HttpPost("login", Name = "ManagerLogin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Login([FromForm] ManagerLoginDTO LoginDTO)
        {
            if (  string.IsNullOrEmpty(LoginDTO.Password) || string.IsNullOrEmpty(LoginDTO.Email))
            {
                return BadRequest(new { message = "Invalied values or empty!" });
            }

            try
            {
                ManagerDTO? managerDTO = await _managerServices.CheckManagerLoginInfo(LoginDTO);

                if (managerDTO is null)
                    return NotFound(new { message = "No manager found!" });

                await _managerServices.HandelManagerLoggedIn(managerDTO.ManagerId);

                var (token,ExpiredTime) = await _tokenServices.CreateNewToken(managerDTO.ManagerId,TokenServices.eUserType.Manager);

                Response.Cookies.Append("AuthToken", token, new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(6)
                });

                return Ok(new { managerDTO,ExpiredTime });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPost("pre-register", Name = "PreRegister")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> PreRegister([FromForm] PersonPreRegisterDTO personPreRegisterDTO)
        {
            if (string.IsNullOrEmpty(personPreRegisterDTO.Password) || string.IsNullOrEmpty(personPreRegisterDTO.Email))
            {
                return BadRequest(new { message = "Email or Password is empty!" });
            }

            if (!_emailVerficationService.CheckIfEmailIsValied(personPreRegisterDTO.Email))
            {
                return BadRequest(new { message = "Invalied Email!" });
            }

            try
            {
                PreRegistredResultDTO preRegistredResult = await _personServices.HandlePreRegisterPersonForManager(personPreRegisterDTO);

                if(preRegistredResult.IsPersonRegistred)
                {
                    (string token, DateTime ExpiredTime) = await _tokenServices.CreateNewToken(preRegistredResult.RegistredPerson!.PersonId, 
                        TokenServices.eUserType.Pre_Registered);

                    Response.Cookies.Append("AuthToken", token, new CookieOptions()
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddHours(1)
                    });
                }

                return Ok(new { preRegistredResult });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Pre Register!");
            }
        }

        [HttpGet("{ManagerId}/logged/status", Name = "logged/status")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckManagerLoginStatus(int ManagerId)
        {
            if (ManagerId <= 0)
                return BadRequest(new { message = "Invalied or empty values!" });

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is invalid or missing");
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                return Ok(new { result = true });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "server error , falied to check login status!" });
            }
        }

        [HttpPost("sendcode", Name = "sendcode")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult SendVerficationCode(int PersonId, [FromBody]string token)
        {
            if (PersonId <= 0)
                return BadRequest("Invalid Person Id , Please check!");

            try
            {
                if (!_emailVerficationService.SendVerificationCodeToEmailProcess(PersonId, null))
                {
                    return NotFound("No Id Was Match !");
                }

                return Ok(new { result = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        } //improve it 

        [HttpPost("checkcode", Name = "checkcode")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CheckVerficationCode(VerficationCodeDTO codeDTO)
        {
            if (codeDTO.UserId <= 0 || string.IsNullOrEmpty(codeDTO.VerficationCode))
                return BadRequest("Invalied values or empty!");

            try
            {
                EmailVerficationResultDTO result = _emailVerficationService
                                                  .CheckVeficationCodeFromUser(codeDTO.UserId, codeDTO.VerficationCode);

                if (result.IsRightCode)
                {
                    if (!await _personServices.MakePersonVerfied(codeDTO.UserId))
                        return StatusCode(StatusCodes.Status500InternalServerError, "code is true, but faild to verfiy,try again!");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("register", Name = "Register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Register([FromForm] MangerRegisterDTO registerDTO, IFormFile? Image)
        {
            PersonRegisterDTO person = registerDTO.PersonRegisterDTO;

            if (person.PersonId <= 0 || string.IsNullOrEmpty(person.FirstName) || string.IsNullOrEmpty(person.LastName)
                || string.IsNullOrEmpty(person.Phone))
            {
                return BadRequest("Invalid values of empty!");
            }

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Invalied or empty token!" });

            try
            {
                if(!await _tokenServices.CheckIfTokenCorrect(registerDTO.PersonRegisterDTO.PersonId,TokenServices.eUserType.Pre_Registered,token))
                    return Unauthorized(new { message = "token is not correct!"});

                if (Image is not null)
                {
                    using (var stream = Image.OpenReadStream())
                    {
                        registerDTO.PersonRegisterDTO.ProfileImageLink =
                            await _fileUploadService.UploadImageAsync(stream, Image.FileName);
                    }
                }

                ManagerDTO? managerDTO = await _managerServices.AddNewManager(registerDTO);

                if (managerDTO is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message="Faild to add !" });


                (string Token,DateTime ExpiredTime) = await _tokenServices.CreateNewToken(managerDTO.ManagerId,TokenServices.eUserType.Manager);

                Response.Cookies.Append("AuthToken", Token, new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(6)
                });

                return Ok(new { managerDTO , ExpiredTime });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to add, Server Error!");
            }
        }

        [HttpPost("sendcode/logged", Name = "sendcode/logged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SendVerficationCodeLoggedIn(int ManagerId)
        {
            if (ManagerId <= 0)
                return BadRequest("Invalied or Empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is invalid or missing");
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                if (!_emailVerficationService.SendVerificationCodeToEmailProcess(ManagerId, TokenServices.eUserType.Manager))
                {
                    return NotFound("No Id Was Match !");
                }

                return Ok(new { result = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to send!");
            }
        }

        [HttpPut("changemail", Name = "changeEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ChangeEmail(ChangeEmailRequestDTO requestDTO)
        {
            if (requestDTO.UserId <= 0 || string.IsNullOrEmpty(requestDTO.NewEmail) || string.IsNullOrEmpty(requestDTO.VerficationCode))
                return BadRequest("Invalied values or empty!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is invalid or missing");
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(requestDTO.UserId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                EmailVerficationResultDTO resultDTO = _emailVerficationService
                                                      .CheckVeficationCodeFromUser(requestDTO.UserId, requestDTO.VerficationCode);

                if (resultDTO.IsRightCode)
                {
                    if (!await _managerServices.ChangeEmail(requestDTO.UserId, requestDTO.NewEmail))
                        return StatusCode(StatusCodes.Status500InternalServerError, "Code is correct,but faild to Update!");
                }

                return Ok(new { resultDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("resetpassword/logged", Name = "resetpassword/logged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ResetPasswordLoggedIn(ChangePasswordReqDTO reqDTO)
        {
            if (reqDTO.UserId <= 0 || string.IsNullOrEmpty(reqDTO.currentPassowrd) || string.IsNullOrEmpty(reqDTO.NewPassword))
                return BadRequest("Invalied or Empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is invalid or missing");
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(reqDTO.UserId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                if (!await _managerServices.ChangePassword(reqDTO.UserId, reqDTO.NewPassword))
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to updated!");

                return Ok(new { result = true });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpPut("resetpassword", Name = "resetpassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO reqDTO)
        {
            if (reqDTO.PersonId <= 0 || string.IsNullOrEmpty(reqDTO.Password))
                return BadRequest("Invalied or empty values!");

            try
            {
                int ManagerId = await _managerServices.GetManagerIdByPersonId(reqDTO.PersonId);

                if (ManagerId == 0)
                    return NotFound("No Manager Id with this Id!");

                EmailVerficationResultDTO resultDTO = _emailVerficationService
                                                      .CheckVeficationCodeFromUser(reqDTO.PersonId, reqDTO.VerficationCode);

                if (resultDTO.IsRightCode)
                {
                    if (!await _managerServices.ChangePassword(ManagerId, reqDTO.Password))
                        return StatusCode(StatusCodes.Status500InternalServerError, "falied to update!");
                }

                return Ok(new { resultDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getperson", Name = "getperson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckEamil(CheckEmailDTO emailDTO)
        {
            if (string.IsNullOrEmpty(emailDTO.Email))
                return BadRequest("Invalied or empty value!");

            try
            {
                int PersonId = await _personServices.FindPersonIdByEmail(emailDTO.Email);

                if (PersonId == 0)
                    return NotFound("No User with this Email!");

                return Ok(new RegisterdPersonDTO { PersonId = PersonId, Email = emailDTO.Email });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpPost("{ManagerId}/admins/add/pre-register", Name = "AdminPreRegister")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> AdminPreRegister(int ManagerId, [FromForm] PersonPreRegisterDTO personPreRegisterDTO)
        {
            if (string.IsNullOrEmpty(personPreRegisterDTO.Password) || string.IsNullOrEmpty(personPreRegisterDTO.Email)
                || ManagerId <= 0)
            {
                return BadRequest(new { message = "Email or Password is empty!" });
            }

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Token is invalid or missing" });
            }

            if (!_emailVerficationService.CheckIfEmailIsValied(personPreRegisterDTO.Email))
            {
                return BadRequest(new { message = "Invalied Email!" });
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized(new { message = "Token is invalid and not correct!" });

                if (await _emailVerficationService.IsEmailExistInDb(personPreRegisterDTO.Email))
                {
                    return Conflict(new { message = "this email has been taken" });
                }


                RegisterdPersonDTO? registerdPersonDTO = await _personServices.AddPreRegisterdInfo(personPreRegisterDTO);

                if (registerdPersonDTO is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Pre Register!");

                return Ok(new { registerdPersonDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Pre Register!");
            }
        }

        [HttpPost("{ManagerId}/admins/add/register", Name = "AdminRegister")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AdminRegister([FromForm] AdminRegisterDTO registerDTO, int ManagerId)
        {
            if (string.IsNullOrEmpty(registerDTO.PersonRegisterDTO.FirstName) || string.IsNullOrEmpty(registerDTO.PersonRegisterDTO.LastName)
               || string.IsNullOrEmpty(registerDTO.PersonRegisterDTO.Phone) || ManagerId <= 0 )
            {
                return BadRequest("Invalied or empty values!");
            }

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Token is invalid or missing");
            }

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                int? pharmacyId = await _managerServices.GetManagerPharamcyId(ManagerId);

                if (!pharmacyId.HasValue)
                    return Unauthorized(new { message = "This manager does not have pharamcy!" });

                bool result = await _adminService.AddNewAdmin(registerDTO,pharmacyId);

                if (!result)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Faild to add!" });
                }

                return Ok(new { result = true });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpPut("{ManagerId}/change/admin/activate/status", Name = "changeActiveStatus")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangeAdminActiveStatus([FromBody]ChangeActiveStatusDTO statusDTO,int ManagerId)
        {
            if (statusDTO.UserId <= 0 || ManagerId <= 0)
                return BadRequest("Invalied or empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied or empty token!");

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                int? pharmacyId = await _managerServices.GetManagerPharamcyId(ManagerId);

                if(pharmacyId is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Edit  this Admin!");

                if (!await _adminService.ChangeActiveStatus(statusDTO,pharmacyId))
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to DeActivate this Admin!");

                return Ok(new { result = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{ManagerId}/admin/{AdminId}/delete", Name = "deleteAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteAdminFromPharmacy(int ManagerId,int AdminId)
        {
            if (ManagerId < 0 || AdminId < 0)
                return BadRequest(new { message = "invalied or empty values!" });

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied or empty token!");

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                int? pharmacyId = await _managerServices.GetManagerPharamcyId(ManagerId);

                if (pharmacyId is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to delete this Admin!");

                if (!await _adminService.DeleteAdmin(AdminId, pharmacyId))
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to delete this Admin!");

                return Ok(new { result = true });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new {message="Failed to delete this admin!"});
            }

        }

        [HttpGet("{ManagerId}/show/admins",Name ="show_phAdmins")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetPharmacyAdminsList(int ManagerId)
        {
            if (ManagerId <= 0 )
                return BadRequest("Invalied or Empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied or empty token");

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                int? pharmacyId = await _managerServices.GetManagerPharamcyId(ManagerId);

                if (pharmacyId is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild To Get Admins");

                var admins = await _adminService.GetAdminList((int)pharmacyId);

                return Ok(new { admins });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpGet("LoggsHistory",Name ="LoggsHistory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAdminsLoggsHistory(int ManagerId,ShowAdminsLoggsDTO reqDTO)
        {
            if (reqDTO.PharmacyId <= 0 || reqDTO.DateOfLoggs.Year < 2025)
                return BadRequest("Invalied or empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied token or expired!");

            try
            {
                if (!await _tokenServices.CheckIfTokenCorrect(ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                var Logges = await _managerServices.GetAdminsLoggsHistoryForSepcificDay(reqDTO);

                return Ok(new { Logges });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }

        }

        [HttpPut("UpdateInfo",Name ="UpdateInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateManagerInfo(UpdateManagerDTO managerDTO)
        {
            if (string.IsNullOrEmpty(managerDTO.Person.FirstName) || string.IsNullOrEmpty(managerDTO.Person.LastName)
               || string.IsNullOrEmpty(managerDTO.Person.Phone))
            {
                return BadRequest("There is Invalied or Empty values!");
            }

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied token or empty!");

            try
            {

                if (!await _tokenServices.CheckIfTokenCorrect(managerDTO.ManagerId, TokenServices.eUserType.Manager, token))
                    return Unauthorized("Token is invalid and not correct!");

                ManagerDTO ? manager= await _managerServices.UpdateManagerDTO(managerDTO);

                return Ok(new { manager });
            }
            catch( Exception ex )
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }
        }





    }
}
