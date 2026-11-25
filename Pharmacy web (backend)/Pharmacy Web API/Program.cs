using CloudinaryDotNet;
using DatabaseLayer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Mscc.GenerativeAI;
using Services;
using Services.Coordinators;
using Services.ExternalServices.AIServices;
using System.Runtime.InteropServices;

namespace Pharmacy_Web_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddScoped<AdminService>();
            builder.Services.AddScoped<CustomerServices>();
            builder.Services.AddScoped<EmailVerficationService>();
            builder.Services.AddScoped<ManagerServices>();
            builder.Services.AddScoped<MessagesServices>();
            builder.Services.AddScoped<OrderServices>();
            builder.Services.AddScoped<PaymentServices>();
            builder.Services.AddScoped<PharmacyServices>();
            builder.Services.AddScoped<ProductServices>();
            builder.Services.AddScoped<RequestServices>();
            builder.Services.AddScoped<SystemDefaultServices>();
            builder.Services.AddScoped<TokenServices>();
            builder.Services.AddScoped<SystemAdminServices>();
            builder.Services.AddScoped<PersonServices>();
            builder.Services.AddScoped<FileUploadService>();
            builder.Services.AddScoped<AiProductSearchService>();
            builder.Services.AddScoped<ProductSearchCoordinator>();

            builder.Services.AddSingleton(_ =>
            {
                var apiKey = builder.Configuration["GEMINI_API_KEY"]
                             ?? builder.Configuration["Gemini:ApiKey"]
                             ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                             ?? string.Empty;

                return new GoogleAI(apiKey: apiKey);
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Configuration.AddEnvironmentVariables();

            builder.Services.AddDbContext<AppDbContext>(option =>
                                       option.UseSqlServer(builder.Configuration["ConnectionString"]));

            builder.Services.AddSingleton(c =>
            {
                var cloudinary = new Cloudinary(new Account(
                    builder.Configuration["Cloudinary:CloudName"],
                    builder.Configuration["Cloudinary:ApiKey"],
                    builder.Configuration["Cloudinary:ApiSecret"]
                ));

                return cloudinary;
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
                              .AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials();
                    });
            });

            var app = builder.Build();
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("AllowAll");


            app.MapControllers();

            app.Run();
        }
    }
}
