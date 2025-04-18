using UserService.Domain.Base.Exceptions;

namespace UserService.Domain.Base;

public abstract class Entity
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public bool SoftDeleted => DeletedAt.HasValue;
    public bool IsActive => !SoftDeleted;

    public void MarkAsDeleted()
    {
        if (SoftDeleted)
            throw new DomainException("Entity is already deleted.");

        DeletedAt = DateTime.UtcNow;
    }

    public void MarkAsUpdated()
    {
        if (SoftDeleted)
            throw new DomainException("Cannot update a deleted entity.");

        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        if (!SoftDeleted)
            throw new DomainException("Entity is not deleted.");

        DeletedAt = null;
    }
}
