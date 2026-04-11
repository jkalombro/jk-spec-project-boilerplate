using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using __APP_NAME__.Application.Common.Interfaces;

namespace __APP_NAME__.Infrastructure.Identity;

public class TokenService : ITokenService
{
    private const string JWT_SECRET_KEY_CONFIG = "Jwt:SecretKey";
    private const string JWT_ISSUER_CONFIG = "Jwt:Issuer";
    private const string JWT_AUDIENCE_CONFIG = "Jwt:Audience";
    private const string JWT_EXPIRY_MINUTES_CONFIG = "Jwt:ExpiryMinutes";
    private const int JWT_EXPIRY_MINUTES_DEFAULT = 60;

    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(Guid userId, string email, IEnumerable<string> roles)
    {
        var secretKey = _configuration[JWT_SECRET_KEY_CONFIG]
            ?? throw new InvalidOperationException("JWT SecretKey is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var expiryMinutes = _configuration.GetValue<int?>(JWT_EXPIRY_MINUTES_CONFIG) ?? JWT_EXPIRY_MINUTES_DEFAULT;
        var token = new JwtSecurityToken(
            issuer: _configuration[JWT_ISSUER_CONFIG],
            audience: _configuration[JWT_AUDIENCE_CONFIG],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public Guid? ValidateRefreshToken(string refreshToken)
    {
        // Implement refresh token validation based on your storage strategy (e.g. database lookup).
        throw new NotImplementedException("Implement refresh token validation based on your storage strategy.");
    }
}
