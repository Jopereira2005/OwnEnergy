namespace UserService.Domain.Base.Exceptions;

public class DomainException : Exception
{
    public DomainException() { }

    public DomainException(string message)
        : base(message) { }

    public DomainException(string message, Exception innerException)
        : base(message, innerException) { }
}
// This exception is used to indicate domain-specific errors that occur during the execution of the application.
