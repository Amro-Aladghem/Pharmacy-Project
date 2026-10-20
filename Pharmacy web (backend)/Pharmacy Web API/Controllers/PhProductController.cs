using DatabaseLayer.Entities;
using DTOs.ProductDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Identity.Client;
using Services;
using System.Reflection.Metadata;
using static Services.TokenServices;

namespace Pharmacy_Web_API.Controllers
{
    [Route("api/v1/phproducts")]
    [ApiController]
    public class PhProductController : ControllerBase
    {
        private readonly TokenServices _tokenServices;
        private readonly FileUploadService _fileUploadService;
        private readonly PharmacyServices _pharmacyServices;
        private readonly ProductServices _productServices;

        public PhProductController(TokenServices tokenServices, FileUploadService fileUploadService,
            PharmacyServices pharmacyServices, ProductServices productServices)
        {
            _tokenServices = tokenServices;
            _fileUploadService = fileUploadService;
            _pharmacyServices = pharmacyServices;
            _productServices = productServices;
        }

        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddNewProduct([FromForm] NewProductDTO productDTO, IFormFile? Image, [FromQuery]int UserId,[FromQuery] string? role="admin")
        {
            string? ImageURL = null;

            if (!_productServices.AreValuesCorrect(productDTO) || UserId<=0)
                return BadRequest(new { message = "Invalied or empty values!" });

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Invalied Token!" });

            try
            {
                eUserType userType = role.ToLower() == "admin" ? eUserType.Admin : eUserType.Manager;

                if (!await _tokenServices.CheckIfTokenCorrect(UserId,userType, token))
                    return Unauthorized(new { message = "Token is invalid and not correct!" });

                int? PharmacyId = await _pharmacyServices.GetPharmacyIdByPhUserId(UserId, role);

                if (!PharmacyId.HasValue)
                    return Unauthorized(new { messag = "This Manager does not have any Pharmacy!" });

                if(Image is not null)
                {
                    using(Stream stream = Image.OpenReadStream())
                    {
                        ImageURL = await _fileUploadService.UploadImageAsync(stream, Image.FileName);
                    }
                }

                productDTO.SysProduct.ImageURL = ImageURL;
                

                if (!await _productServices.AddNewPhProduct(productDTO,(int)PharmacyId))
                    return StatusCode(StatusCodes.Status500InternalServerError, new { messag = "Faild to add product, please try again!" });

                return Ok(new { result = true });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { messag = ex.Message });
            }
        }

        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<IActionResult> UpdateProduct([FromForm] UpdatedPhProductDTO productDTO, [FromQuery] int userId, 
            [FromQuery] string? role = "admin")
        {
            if (!_productServices.CheckPhProductInfo(productDTO.PhProduct) || productDTO.PhProductId<=0)
            {
                return BadRequest("Invalied values or empty!");
            }

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied Token!");

            try
            {
                eUserType userType = role.ToLower() == "admin" ? eUserType.Admin : eUserType.Manager;

                if (!await _tokenServices.CheckIfTokenCorrect(userId, userType, token))
                    return Unauthorized("Token is invalid and not correct!");

                int? PharmacyId = await _pharmacyServices.GetPharmacyIdByPhUserId(userId, role);

                if (!PharmacyId.HasValue)
                    return Unauthorized(new { message = "This Pharmacy User does not have pharmacy yet!" });

                if (!await _productServices.UpdatedPhProduct(productDTO,(int)PharmacyId))
                    return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Update Product");

                return Ok(new { result = true });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{ProductId}/delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteProduct(int ProductId, [FromQuery] int userId,[FromQuery] string? role = "admin")
        {
            if (ProductId <= 0 || userId <= 0)
                return BadRequest(new { message = "Invalied Values or empty!" });

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Invalied Token!" });

            try
            {
                eUserType userType = role.ToLower() == "admin" ? eUserType.Admin : eUserType.Manager;

                if (!await _tokenServices.CheckIfTokenCorrect(userId, userType, token))
                    return Unauthorized(new { message = "Token is invalid and not correct!" });

                int? PharmacyId = await _pharmacyServices.GetPharmacyIdByPhUserId(userId, role);

                if (!PharmacyId.HasValue)
                    return Unauthorized(new { message = "This Pharmacy User does not have pharmacy yet!" });

                if (!await _productServices.DeletePhProduct(ProductId,(int)PharmacyId))
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Faild to delete this prodcut!" });

                return Ok(new { result = true });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProducts([FromQuery] PaginatedPhProductDTO paginatedPhProductDTO, [FromQuery] int CategoryId, [FromQuery] int? GovernorateId,
            [FromQuery] int? RegionId)
        {
            if (paginatedPhProductDTO.LastPhProductId < 0 || paginatedPhProductDTO.Limit <= 0 
                || CategoryId <= 0)
                return BadRequest("Invalied or empty values!");

            try
            {
                var ProductsResult = await _productServices.GetPhProductList(paginatedPhProductDTO, CategoryId,GovernorateId,RegionId);

                if (ProductsResult is null)
                    return NotFound("No data was found!");

                return Ok(new { ProductsResult });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{ProductId}/full-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductFullInfo (int ProductId)
        {
            try
            {
                var ProductInfo = await _productServices.GetProductFullInfo(ProductId);

                if(ProductInfo is null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to get data!,Server Error" });

                return Ok(new { ProductInfo });
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to get data!,Server Error" });
            }
        }

        [HttpGet("list")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPharmacyProductList([FromQuery] PaginatedPhProductDTO paginatedPhProductDTO, [FromQuery] int PharmacyId)
        {
            if (paginatedPhProductDTO.LastPhProductId < 0  || paginatedPhProductDTO.Limit <= 0
                || PharmacyId <= 0)
                return BadRequest("Invalied or empty values!");

            try
            {
                var Products = await _productServices.GetPharmacyProductsListById(paginatedPhProductDTO, PharmacyId);

                if (Products is null)
                    return NotFound("No data was found!");

                return Ok(new { Products });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }
        }

        [HttpGet("info/{ProductId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductDetails(int ProductId, [FromQuery] int PharmacyId)
        {
            if (ProductId <= 0 || PharmacyId <= 0)
                return BadRequest("Invalied or empty values!");

            try
            {
                var ProductDetails = await _productServices.GetProductInfoForShowing(ProductId, PharmacyId);

                if (ProductDetails is null)
                    return NotFound("This Product Not Found!");

                return Ok(ProductDetails);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex.Message);
            }
        }

        [HttpGet("description/{ProductId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetProductDescription(int ProductId)
        {
            if (ProductId <= 0)
                return BadRequest("Invalied or empty values!");

            try
            {
                var Description = await _productServices.ReturnPhProductDescription(ProductId);

                return Ok(Description);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpGet("Get/Products/{PharmacyId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GerPharmacyProducts(int PharmacyId,[FromQuery] int UserId, [FromForm] PaginatedPhProductDTO paginatedPhProductDTO,
            [FromQuery] string? role = "admin")
            
        {
            if (PharmacyId <= 0 || UserId <= 0 || paginatedPhProductDTO.LastPhProductId <= 0 || paginatedPhProductDTO.Limit <= 0)
                return BadRequest("Invalied or empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied token!");

            try
            {
                eUserType userType = role.ToLower() == "admin" ? eUserType.Admin : eUserType.Manager;

                if (!await _tokenServices.CheckIfTokenCorrect(UserId, userType, token))
                    return Unauthorized("Token is invalid and not correct!");

                if (!await _pharmacyServices.IsPharmacyHasThisUser(UserId, userType,PharmacyId))
                    return Unauthorized("You are not Admin or Manager for this Pharmacy!");

                var Products = await _productServices.GetProductsForAdmins(paginatedPhProductDTO, PharmacyId);

                if (Products is null)
                    return NotFound("No data was found!");

                return Ok(Products);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Upload products!");
            }
        }

        [HttpGet("Get/{ProductId}/Info/{PharmacyId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<IActionResult> GetProductInfoForPharmacyUsers(int ProductId,int PharmacyId, [FromQuery] int UserId, 
            [FromQuery] string? role = "admin")
        {
            if (ProductId <= 0 || PharmacyId <= 0 || UserId <= 0)
                return BadRequest("Invalied or Empty values!");

            var token = Request.Cookies["AuthToken"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalied token!");

            try
            {
                eUserType userType = role.ToLower() == "admin" ? eUserType.Admin : eUserType.Manager;

                if (!await _tokenServices.CheckIfTokenCorrect(UserId, userType, token))
                    return Unauthorized("Token is invalid and not correct!");

                if (!await _pharmacyServices.IsPharmacyHasThisUser(UserId, userType, PharmacyId))
                    return Unauthorized("You are not Admin or Manager for this Pharmacy!");

                var ProductDetails = await _productServices.ShowProductInfoForAdmin(ProductId);

                if (ProductDetails is null)
                    return NotFound("No data was found!");

                return Ok(ProductDetails);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to Upload Info!");
            }
        }

        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SearchingForProductByName([FromQuery]string searchtext, [FromQuery] int LastPhProductId=0)
        {
            if (string.IsNullOrEmpty(searchtext))
                return BadRequest("Invalied or empty values!");

            try
            {


                var ProductsResult =await  _productServices.GetMatchProductFromSearching(searchtext, LastPhProductId);

                if (ProductsResult is null && LastPhProductId == 0)
                {
                    return NotFound("No data was matched");
                }

                return Ok(new { ProductsResult });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Faild to get data!");
            }
        }

        [HttpGet("sysproducts/search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SearchSysProductByName([FromQuery] string searchtext)
        {
            if (string.IsNullOrEmpty(searchtext))
                return BadRequest(new { message = "Invalied or empty values!" });

            try
            {
                var products = await _productServices.GetMatchSysProductByName(searchtext);

                return Ok(new {products});
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Faild to get Data, Server Error!" });
            }
        }

    }
}
