using OHMontageApp.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OHMontageApp
{
    /// <summary>
    /// Interaction logic for Montage.xaml
    /// </summary>
    public partial class Montage : UserControl
    {
        public Montage()
        {
            InitializeComponent();
            bindExampleList();
        }

        private void bindExampleList()
        {
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var temp = this.DataContext;
        }
    }
}
