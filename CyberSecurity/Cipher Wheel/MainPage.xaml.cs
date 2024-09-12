using Microsoft.Maui.Graphics.Text;
using System.Diagnostics;
using System.Security.AccessControl;
using static System.Net.Mime.MediaTypeNames;

namespace Testing
{
    public partial class MainPage : ContentPage
    {

        double rot = 0;
        int shift = 0;
        double change = 13.8461538462;
        int count = 0;
       
        double panX = 360;
        double deg = 13.9939765930176;
        double turn;
        public MainPage()
        {
            InitializeComponent();
            rot = 360;
            bot.Rotation = rot;
        }


       
            //Turn.Text = string.Format("Rotation degrees: {0}", rot);
            //Key.Text = string.Format("Shift: {0}", shift);
        
        private void ClickRight(object sender, EventArgs e)
        {

            if (rot > 14 && shift < 25)
            {
                rot -= 13.8461538462;
                Trace.WriteLine(rot);
            }
            if (shift < 25)
            {
                shift += 1;
            }
            else
            {
                shift = 0;
                rot = 360;
                bot.Rotation = Math.Round(rot);
            }
            bot.Rotation = Math.Round(rot);
            Key.Text = string.Format("Shift: {0}", shift);


        }
        private void ClickLeft(object sender, EventArgs e)
        {
            if (rot < 360)
            {
                rot += 13.8461538462;
                Trace.WriteLine(rot);
            }
            if (shift > 0)
            {
                shift -= 1;
            }
            else
            {
                shift = 25;
                rot = 13.846153844999883;
                bot.Rotation = Math.Round(rot);
            }
            bot.Rotation = Math.Round(rot);
            Key.Text = string.Format("Shift: {0}", shift);
            

        }

       

        private void ClickReset(object sender, EventArgs e)
        {

            rot = 360;
            shift = 0;
            bot.Rotation = Math.Round(rot);
            Key.Text = string.Format("Shift: 0");

        }

        private void PanGestureRecognizer_PanUpdated(object sender, PanUpdatedEventArgs e)
        {



           
            switch (e.StatusType)
            {
                case GestureStatus.Running:
                    // Translate and pan.
                    double boundsX = bot.Width;
                    double boundsY = bot.Height;
                    turn = e.TotalX / 3;
                    
                    bot.Rotation = Math.Clamp(panX - turn, -boundsX, boundsX);


                    //Test onwards
                    if (shift == 0 && bot.Rotation > 366)
                    {
                        shift = 25;
                        bot.Rotation = 13.846153844999883;
                    }
                    else if (shift == 25 && bot.Rotation < 13.846153844999883)
                    {
                        shift = 0;
                        bot.Rotation = 360;
                    }
                    if (bot.Rotation >= 360)
                    {
                        shift = 0;
                        bot.Rotation = 360;
                    }
                    else if (bot.Rotation > 346 && bot.Rotation < 359)
                    {
                        shift = 1;
                        bot.Rotation = 346.1538461538;
                    }

                    else if (bot.Rotation > 332 && bot.Rotation < 346)
                    {
                        shift = 2;
                        bot.Rotation = 332.30769230759995;
                    }

                    else if (bot.Rotation > 318 && bot.Rotation < 332)
                    {
                        shift = 3;
                        bot.Rotation = 318.4615384613999;
                    }

                    else if (bot.Rotation > 304 && bot.Rotation < 318)
                    {
                        shift = 4;
                        bot.Rotation = 304.6153846151999;
                    }

                    else if (bot.Rotation > 290 && bot.Rotation < 304)
                    {
                        shift = 5;
                        bot.Rotation = 290.7692307689999;
                    }

                    else if (bot.Rotation > 276 && bot.Rotation < 290)
                    {
                        shift = 6;
                        bot.Rotation = 276.92307692279985;
                    }
                    else if (bot.Rotation > 263 && bot.Rotation < 276)
                    {
                        shift = 7;
                        bot.Rotation = 263.0769230765998;
                    }
                    else if (bot.Rotation > 249 && bot.Rotation < 263)
                    {
                        shift = 8;
                        bot.Rotation = 249.23076923039983;
                    }
                    else if (bot.Rotation > 235 && bot.Rotation < 249)
                    {
                        shift = 9;
                        bot.Rotation = 235.38461538419983;
                    }
                    else if (bot.Rotation > 221 && bot.Rotation < 235)
                    {
                        shift = 10;
                        bot.Rotation = 221.53846153799984;
                    }
                    else if (bot.Rotation > 207 && bot.Rotation < 221)
                    {
                        shift = 11;
                        bot.Rotation = 207.69230769179984;
                    }
                    else if (bot.Rotation > 193 && bot.Rotation < 207)
                    {
                        shift = 12;
                        bot.Rotation = 193.84615384559984;
                    }
                    else if (bot.Rotation > 179 && bot.Rotation < 193)
                    {
                        shift = 13;
                        bot.Rotation = 179.99999999939985;
                    }
                    else if (bot.Rotation > 166 && bot.Rotation < 179)
                    {
                        shift = 14;
                        bot.Rotation = 166.15384615319985;
                    }
                    else if (bot.Rotation > 152 && bot.Rotation < 166)
                    {
                        shift = 15;
                        bot.Rotation = 152.30769230699985;
                    }
                    else if (bot.Rotation > 138 && bot.Rotation < 152)
                    {
                        shift = 16;
                        bot.Rotation = 138.46153846079986;
                    }
                    else if (bot.Rotation > 124 && bot.Rotation < 138)
                    {
                        shift = 17;
                        bot.Rotation = 124.61538461459986;
                    }
                    else if (bot.Rotation > 110 && bot.Rotation < 124)
                    {
                        shift = 18;
                        bot.Rotation = 110.76923076839986;
                    }
                    else if (bot.Rotation > 96 && bot.Rotation < 110)
                    {
                        shift = 19;
                        bot.Rotation = 96.92307692219987;
                    }
                    else if (bot.Rotation > 83 && bot.Rotation < 96)
                    {
                        shift = 20;
                        bot.Rotation = 83.07692307599987;
                    }
                    else if (bot.Rotation > 69 && bot.Rotation < 83)
                    {
                        shift = 21;
                        bot.Rotation = 69.23076922979988;
                    }
                    else if (bot.Rotation > 55 && bot.Rotation < 69)
                    {
                        shift = 22;
                        bot.Rotation = 55.38461538359988;
                    }
                    else if (bot.Rotation > 41 && bot.Rotation < 55)
                    {
                        shift = 23;
                        bot.Rotation = 41.53846153739988;
                    }
                    else if (bot.Rotation > 27 && bot.Rotation < 41)
                    {
                        shift = 24;
                        bot.Rotation = 27.692307691199883;
                    }
                    else if (bot.Rotation <= 14)
                    {
                        shift = 25;
                        bot.Rotation = 13.846153844999883;

                    }
               

                    //Test 2nd here


                    //bot.Rotation = Math.Clamp(panY + e.TotalY, -boundsY, boundsY);
                    Trace.WriteLine("PanX: " + panX);
                    Trace.WriteLine("Rotation: " + bot.Rotation);
                    Trace.WriteLine("Shift: " + shift);
                    Key.Text = string.Format("Shift: {0}", shift);
                    break;

                case GestureStatus.Completed:
                    // Store the translation applied during the pan
                    panX = bot.Rotation;
                    //panY = bot.Rotation;
                    break;
            }

        }




    }

}
