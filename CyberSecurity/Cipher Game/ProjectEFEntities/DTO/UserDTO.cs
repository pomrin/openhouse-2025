namespace ProjectEFEntities.DTO
{
    public class UserDTO
    {
        private string firstName;
        private string lastName;
        private string email;
        private string password;
        private int? userStatusId;

        public string FirstName
        {
            get
            {
                return firstName;
            }

            set
            {
                firstName = value;
            }
        }

        public string LastName
        {
            get
            {
                return lastName;
            }

            set
            {
                lastName = value;
            }
        }

        public string Email
        {
            get
            {
                return email;
            }

            set
            {
                email = value;
            }
        }

        public string Password
        {
            get
            {
                return password;
            }

            set
            {
                password = value;
            }
        }

        public int? UserStatusId
        {
            get
            {
                return userStatusId;
            }

            set
            {
                userStatusId = value;
            }
        }
    }
}
