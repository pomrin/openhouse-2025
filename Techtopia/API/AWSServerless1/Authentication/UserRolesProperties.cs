using System.ComponentModel;
using System.Runtime.CompilerServices;
using static AWSServerless1.Authentication.UserRolesProperties;

namespace AWSServerless1.Authentication
{
    public static class UserRolesProperties
    {
        public const String USER_ROLES_DESCRIPTION_VISITOR = "VISITOR";
        public const String USER_ROLES_DESCRIPTION_BOOTH_HELPER = "BOOTH_HELPER";
        public const String USER_ROLES_DESCRIPTION_ADMIN = "ADMIN";


        public const String CONTROLLER_USER_ROLES_VISITOR_AND_ABOVE = $"{USER_ROLES_DESCRIPTION_VISITOR}, {USER_ROLES_DESCRIPTION_BOOTH_HELPER}, {USER_ROLES_DESCRIPTION_ADMIN}";
        public const String CONTROLLER_USER_ROLES_BOOTH_HELPER_AND_ADMIN = $"{USER_ROLES_DESCRIPTION_BOOTH_HELPER}, {USER_ROLES_DESCRIPTION_ADMIN}";



        public enum USER_ROLES
        {
            [Description(USER_ROLES_DESCRIPTION_VISITOR)]
            VISITOR = 1,
            [Description(USER_ROLES_DESCRIPTION_BOOTH_HELPER)]
            BOOTH_HELPER = 2,
            [Description(USER_ROLES_DESCRIPTION_ADMIN)]
            ADMIN = 3,

        }


    }
    public static class MyEnumExtensions
    {
        public static string ToDescriptionString(this USER_ROLES val)
        {
            DescriptionAttribute[] attributes = (DescriptionAttribute[])val.GetType()
                .GetField(val.ToString())
                .GetCustomAttributes(typeof(DescriptionAttribute), false);
            return attributes.Length > 0 ? attributes[0].Description : string.Empty;
        }
    }

}
