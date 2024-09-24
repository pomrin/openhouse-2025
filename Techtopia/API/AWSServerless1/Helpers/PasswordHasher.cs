namespace AWSServerless1.Helpers
{
    public static class PasswordHasher
    {
        public static String HashPassword(String password)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            return hashedPassword;
        }


        public static bool VerifyPassword(String password, String hashedPassword)
        {
            bool result = BCrypt.Net.BCrypt.Verify(password, hashedPassword);

            return result;
        }
    }
}
