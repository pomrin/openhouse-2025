using AWSServerless1.Constants;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using System.Web.Cors;

namespace AWSServerless1;

public class Startup
{
    private static readonly String API_NAME = "Customers API V1";
    String MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    private static readonly String customCorsPolicy = "customCorsPolicy";

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container
    public void ConfigureServices(IServiceCollection services)
    {
        // Razor Pages
        services.AddRazorPages();

        // CORS settings
        services.AddCors(options =>
        {
            options.AddPolicy(name: customCorsPolicy,
                policy =>
                {
                    policy
                      .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                      //.WithOrigins("http://example.com", "http://www.contoso.com") // For Multiple Origins
                      .AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
                });
        });


        // JWT Authentication setup Start
        // Read from appsettings.json
        var jwtIssuer = Configuration.GetSection(AMSAppSettings.APP_SETTINGS_KEY_JWT_ISSUER).Get<string>();
        var jwtKey = Configuration.GetSection(AMSAppSettings.APP_SETTINGS_KEY_JWT_KEY).Get<string>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
        //Jwt configuration ends here

        services.AddControllers();

        // Swagger Documentations
        services.AddSwaggerGen(swagger =>
        {
            swagger.SwaggerDoc("v1", new OpenApiInfo { Title = API_NAME });
            // Add Bearer token for authentication
            // Include 'SecurityScheme' to use JWT Authentication
            var jwtSecurityScheme = new OpenApiSecurityScheme
            {
                BearerFormat = "JWT",
                Name = "JWT Authentication",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                Reference = new OpenApiReference
                {
                    Id = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            };

            swagger.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

            swagger.AddSecurityRequirement(new OpenApiSecurityRequirement    {
                {
                    jwtSecurityScheme,
                    Array.Empty<string>()
                }
            });


            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            swagger.IncludeXmlComments(xmlPath);
        });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        //Swagger
        app.UseSwagger(c =>
        {
            c.RouteTemplate = "swagger/{documentName}/swagger.json";
        });

        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("v1/swagger.json", API_NAME);
            c.RoutePrefix = "swagger";
        });

        app.UseCors(customCorsPolicy);

        app.UseAuthentication();
        app.UseAuthorization();


        app.UseEndpoints(endpoints =>
        {
            endpoints.MapRazorPages();
            endpoints.MapControllers();
            //endpoints.MapGet("/", async context =>
            //{
            //    await context.Response.WriteAsync("Welcome to running ASP.NET Core on AWS Lambda");
            //});
        });

        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            options.RoutePrefix = string.Empty;
        });
    }
}