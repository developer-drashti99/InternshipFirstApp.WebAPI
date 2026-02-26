namespace FirstApp.WebAPI.Interfaces
{
    public interface ITokenService
    {
        public Task<string> CreateToken(AppUser user);
        string GenerateRefreshToken();
    }
}
