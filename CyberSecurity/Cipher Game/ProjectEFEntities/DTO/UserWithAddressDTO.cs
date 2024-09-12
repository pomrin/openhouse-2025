using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectEFEntities.DTO
{
    internal class UserWithAddressDTO : UserDTO
    {
        private AddressDTO adddresses;

        public AddressDTO Adddresses
        {
            get
            {
                return adddresses;
            }

            set
            {
                adddresses = value;
            }
        }
    }
}
