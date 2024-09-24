namespace AWSServerless1.DTO
{
    public class AdminLoginDTO
    {
        private String userName;
        private String password;

        public string UserName
        {
            get
            {
                return this.userName;
            }

            set
            {
                this.userName = value;
            }
        }

        public string Password
        {
            get
            {
                return this.password;
            }

            set
            {
                this.password = value;
            }
        }
    }
}
