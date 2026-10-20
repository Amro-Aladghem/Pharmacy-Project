using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.CustomerDTOs
{
    public class CustomerContactDTO
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }    
        public string PhoneNumber { get; set; }
        public string location { get; set; }
    }
}
