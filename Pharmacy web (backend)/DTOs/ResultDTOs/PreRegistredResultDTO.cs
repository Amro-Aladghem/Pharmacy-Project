using DTOs.PersonDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.ResultDTOs
{
    public class PreRegistredResultDTO
    {
        public bool IsPersonRegistred { get; set; }
        public string? message { get; set; }
        public RegisterdPersonDTO? RegistredPerson {get;set;}
    }
}
