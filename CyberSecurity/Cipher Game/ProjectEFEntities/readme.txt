Scaffold-DbContext "server=docfiledb-t2.cxljlbpdqrxq.ap-southeast-1.rds.amazonaws.com,3306;user id=dotnetdev01;password=Dotnetdev@123;persist security info=True;database=docufiledb" Pomelo.EntityFrameworkCore.MySql -OutputDir EntityFrameworkModels -f


Scaffold-DbContext "server=docfiledb-t2.cxljlbpdqrxq.ap-southeast-1.rds.amazonaws.com,3306;user id=dotnetdev01;password=Dotnetdev@123;persist security info=True;database=jnrvehicleauctiondb" Pomelo.EntityFrameworkCore.MySql -OutputDir JnrEfModels -f


Scaffold-DbContext "server=docfiledb-t2.cxljlbpdqrxq.ap-southeast-1.rds.amazonaws.com,3306;user id=dotnetdev01;password=Dotnetdev@123;persist security info=True;database=openhouse24" Pomelo.EntityFrameworkCore.MySql -OutputDir OpenHouseEfModels -f