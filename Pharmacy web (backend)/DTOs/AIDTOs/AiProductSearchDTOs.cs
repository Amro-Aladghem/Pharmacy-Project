using System.Collections.Generic;
using DTOs.ProductDTOs;

namespace DTOs.AIDTOs
{
    public class AiProductSearchRequestDTO
    {
        public string? Message { get; set; }
    }

    public class AiProductSearchResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public List<ListingProductDTO> Products { get; set; } = new List<ListingProductDTO>();
    }
}
