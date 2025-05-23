namespace UserService.Application.Common.Services.Token;

public class JwtSettings
{
    public string Key { get; set; } = "KJSDAH9872Y3HE92RH9KJ3H2J1K3H21JK";
    public string Issuer { get; set; } = "OwnEnergyServer";
    public string Audience { get; set; } = "OwnEnergyClient";
    public int ExpireMinutes { get; set; } = 60;
}
