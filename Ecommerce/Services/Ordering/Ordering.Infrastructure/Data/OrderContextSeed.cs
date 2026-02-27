using Microsoft.Extensions.Logging;
using Ordering.Core.Entities;

namespace Ordering.Infrastructure.Data
{
    public class OrderContextSeed
    {
        public static async Task SeedAsync(OrderContext orderContext, ILogger<OrderContextSeed> logger)
        {
            if (!orderContext.Orders.Any())
            {
                orderContext.Orders.AddRange(GetOrders());
                await orderContext.SaveChangesAsync();
                logger.LogInformation($"Ordering Database: {typeof(OrderContext).Name} seeded");
            }
        }

        private static IEnumerable<Order> GetOrders()
        {
            return new List<Order>
            { 
                new()
                { 
                    UserName = "Hieu.Truong",
                    FirstName = "Hieu",
                    LastName = "Truong",
                    EmailAddress = "giahieu0201@gmail.com",
                    AddressLine = "Pham Van Hai",
                    State = "VN",
                    Country = "VietNam",
                    ZipCode = "700000",

                    CardName = "Visa",
                    CardNumber = "4111111111111111",
                    CreatedBy = "TRUONG GIA HIEU",
                    Expiration = "12/25",
                    Cvv = "123",
                    PaymentMethod = 1,
                    LastModifiedBy = "Hieu.Truong",
                    LastModifiedDate = DateTime.UtcNow
                }
            };
        }
    }
}
