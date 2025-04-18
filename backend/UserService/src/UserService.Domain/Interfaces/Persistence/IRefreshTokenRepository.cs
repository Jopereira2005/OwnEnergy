using UserService.Domain.Models.Entities;

namespace UserService.Domain.Interfaces.Persistence;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<IEnumerable<RefreshToken>> GetTokensByUserIdAsync(
        Guid cooperatorId,
        CancellationToken cancellationToken = default
    );
    Task<RefreshToken?> GetLatestValidTokenByUserIdAsync(
        Guid cooperatorId,
        CancellationToken cancellationToken = default
    );
    Task RevokeTokenAsync(string token, CancellationToken cancellationToken = default);
    Task RevokeTokensByUserIdAsync(
        Guid cooperatorId,
        CancellationToken cancellationToken = default
    );
    Task DeleteAllUserTokensAsync(Guid cooperatorId, CancellationToken cancellationToken = default);
    Task DeleteAllTokensAsync(CancellationToken cancellationToken = default);
}
