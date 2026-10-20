using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.ProductDTOs
{
    public class SysProductDTO
    {
        public int? SysProductId { get; set; }

        public string ProductName { get; set; }

        public string Description { get; set; } 

        public string? ImageURL { get; set; }

    }
}
