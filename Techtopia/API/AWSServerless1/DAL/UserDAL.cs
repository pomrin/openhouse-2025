using BCrypt.Net;
using ProjectEFEntities.OH25EntityModels;

namespace AWSServerless1.DAL
{
    public static class UserDAL
    {
        public static User Login(String userName, String password)
        {
            User result = null;
            using (var context = new Openhouse25Context())
            {
                var qUserbyUserName = from q in context.Users
                                      where userName.Trim().ToUpper().CompareTo(q.UserName.Trim().ToUpper()) == 0
                                      select q;
                if (qUserbyUserName != null && qUserbyUserName.Count() > 0)
                {

                    var user = qUserbyUserName.First();
                    //var salt = BCrypt.Net.BCrypt.GenerateSalt();
                    var isPassValid = BCrypt.Net.BCrypt.EnhancedVerify(password, user.Password);
                    if (isPassValid)
                    {
                        result = user;
                    }
                    else
                    {
                        Console.WriteLine($"Invalid Password for User: {userName}");
                    }
                }
                else
                {
                    Console.WriteLine($"Invalid User: {userName}");
                }

            }

            return result;
        }

        public static User CreateUser(String userName, String password)
        {
            User result = null;
            try
            {
                using (var context = new Openhouse25Context())
                {
                    var qUserbyUserName = from q in context.Users
                                          where userName.Trim().ToUpper().CompareTo(q.UserName.Trim().ToUpper()) == 0
                                          select q;
                    if (qUserbyUserName != null && qUserbyUserName.Count() > 0)
                    {
                        Console.WriteLine($"Username: {userName} already exists.");
                    }
                    else
                    {
                        User user = new User()
                        {
                            UserName = userName.Trim().ToUpper(),
                            Password = BCrypt.Net.BCrypt.EnhancedHashPassword(password),
                        };
                        context.Users.Add(user);
                        context.SaveChanges();
                        result = user;
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception have occurred in CreateUser(userName: {userName}, password: xxx) - {ex.Message}.");
            }

            return result;
        }
    }
}
