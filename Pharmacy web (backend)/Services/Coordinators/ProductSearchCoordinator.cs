using DTOs.AIDTOs;
using DTOs.ProductDTOs;
using Services.ExternalServices.AIServices;
using System.Text.Json;

namespace Services.Coordinators
{
    public class ProductSearchCoordinator
    {
        private const int MaxRecommendedProducts = 8;

        private readonly ProductServices _productServices;
        private readonly AiProductSearchService _aiProductSearchService;

        public ProductSearchCoordinator(ProductServices productServices, AiProductSearchService aiProductSearchService)
        {
            _productServices = productServices;
            _aiProductSearchService = aiProductSearchService;
        }

        public async Task<AiProductSearchResponseDTO> SearchProductsAsync(string userMessage)
        {
            // First: load every pharmacy product (not system products) from the existing product service.
            var products = await _productServices.GetAllPharmacyProductsForAiSearch();

            if (products.Count == 0)
            {
                return new AiProductSearchResponseDTO
                {
                    Message = "لا توجد منتجات متاحة في الصيدليات حاليًا."
                };
            }

            // Second: send only the product id and name to the AI service with the user message.
            var candidates = products
                .Select(p => new AiProductCandidate(p.PhProductId, p.Name))
                .ToList();

            var aiResponse = await _aiProductSearchService.SearchProducts(userMessage, candidates);
            var selectedIds = ParseProductIds(aiResponse);

            // Third: filter the original data and send the matched products back at the end of the response.
            var matchedProducts = products
                .Where(p => selectedIds.Contains(p.PhProductId))
                .Take(MaxRecommendedProducts)
                .ToList();

            var message = matchedProducts.Count > 0
                ? $"وجدت {matchedProducts.Count} منتجًا قد يناسب طلبك."
                : "لم أجد منتجًا مطابقًا حاليًا. جرّب وصفًا آخر.";

            return new AiProductSearchResponseDTO
            {
                Message = message,
                Products = matchedProducts
            };
        }

        private static List<int> ParseProductIds(string? responseText)
        {
            var ids = new List<int>();

            if (string.IsNullOrWhiteSpace(responseText))
            {
                return ids;
            }

            var cleaned = responseText.Trim();

            if (cleaned.StartsWith("```", StringComparison.Ordinal))
            {
                var firstLineBreak = cleaned.IndexOf('\n');
                if (firstLineBreak >= 0)
                {
                    cleaned = cleaned[(firstLineBreak + 1)..];
                }

                cleaned = cleaned.Trim().TrimEnd('`').Trim();
            }

            var start = cleaned.IndexOf('[');
            var end = cleaned.LastIndexOf(']');

            if (start < 0 || end <= start)
            {
                return ids;
            }

            var json = cleaned[start..(end + 1)];

            try
            {
                var parsed = JsonSerializer.Deserialize<List<int>>(json);
                if (parsed is not null)
                {
                    ids.AddRange(parsed.Where(id => id > 0).Distinct());
                }
            }
            catch (JsonException)
            {
                // Keep the response graceful if the model returns a malformed JSON array.
            }

            return ids;
        }
    }
}
