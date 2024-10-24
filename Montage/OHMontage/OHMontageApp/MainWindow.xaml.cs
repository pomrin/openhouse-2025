using OHMontageApp.ViewModel;
using System.Collections.ObjectModel;
using System.Text;
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
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();

            this.DataContext = new MainWindowVM();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var vm = this.DataContext as MainWindowVM;

            if (vm != null)
            {
                //for (int i = 0; i < 25; i++)
                //{
                var photosVM = vm.MontageViewModel.Photos;
                int random = new Random().Next(0, photosVM.Count);
                photosVM[random].IsJiggle = true;
                //}
            }
        }
    }
}