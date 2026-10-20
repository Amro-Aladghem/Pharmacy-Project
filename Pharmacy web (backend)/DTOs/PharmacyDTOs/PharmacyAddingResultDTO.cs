using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.PharmacyDTOs
{
    public class PharmacyAddingResultDTO
    {
        public int PharmacyId { get; set; }
        public string PharmacyName { get; set; }
        public string ImageURL {  get; set; }
        public string PINCode { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
