using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectEFEntities.DTO
{
    public class VehicleDTO
    {
        private int vehicleId;
        private String vehiclePlateNo;

        public int VehicleId
        {
            get
            {
                return vehicleId;
            }

            set
            {
                vehicleId = value;
            }
        }

        public string VehiclePlateNo
        {
            get
            {
                return vehiclePlateNo;
            }

            set
            {
                vehiclePlateNo = value;
            }
        }
    }
}
