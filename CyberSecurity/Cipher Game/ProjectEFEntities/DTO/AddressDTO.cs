
namespace ProjectEFEntities.DTO
{
    public class AddressDTO
    {
        private int addressID;
        private String address1;
        private String address2;
        private String address3;
        private UserDTO userDTO;

        public int AddressID
        {
            get
            {
                return addressID;
            }

            set
            {
                addressID = value;
            }
        }

        public string Address1
        {
            get
            {
                return address1;
            }

            set
            {
                address1 = value;
            }
        }

        public string Address2
        {
            get
            {
                return address2;
            }

            set
            {
                address2 = value;
            }
        }

        public string Address3
        {
            get
            {
                return address3;
            }

            set
            {
                address3 = value;
            }
        }

        public UserDTO UserDTO
        {
            get
            {
                return userDTO;
            }

            set
            {
                userDTO = value;
            }
        }
    }
}
