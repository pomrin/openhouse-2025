using Microsoft.Maui.Graphics.Text;
using System.Diagnostics;
using System.Security.AccessControl;
using static System.Net.Mime.MediaTypeNames;

namespace Testing
{
    public partial class MainPage : ContentPage
    {
        private const double RotationStep = 13.8461538462;
        private const double FullRotation = 360;
        private const int MaxShift = 25;
        private double rotation = FullRotation;
        private int shift = 0;
        private double panX = FullRotation;

        public MainPage()
        {
            InitializeComponent();
            UpdateRotation(rotation);
        }
        //Turn.Text = string.Format("Rotation degrees: {0}", rot);
        //Key.Text = string.Format("Shift: {0}", shift);
        private void ClickRight(object sender, EventArgs e)
        {
            if (shift < MaxShift)
            {
                rotation -= RotationStep;
                shift++;
            }
            else
            {
                ResetRotation();
            }

            SnapToNearestStep();
        }

        private void ClickLeft(object sender, EventArgs e)
        {
            if (shift > 0)
            {
                rotation += RotationStep;
                shift--;
            }
            else
            {
                rotation = RotationStep;
                shift = MaxShift;
            }

            SnapToNearestStep();
        }

        private void ClickReset(object sender, EventArgs e)
        {
            ResetRotation();
        }

        //Change the if else statements to a more simplified and efficient code

        private void PanGestureRecognizer_PanUpdated(object sender, PanUpdatedEventArgs e)
        {
            switch (e.StatusType)
            {
                case GestureStatus.Running:
                    double turn = e.TotalX / 3;
                    rotation = panX - turn;

                    // Keep rotation within bounds
                    if (rotation < 0) rotation += FullRotation;
                    if (rotation >= FullRotation) rotation -= FullRotation;

                    // Update shift dynamically during the gesture
                    shift = CalculateShiftFromRotation(rotation);
                    UpdateRotation(rotation);
                    break;

                case GestureStatus.Completed:
                    // Snap to the nearest step when the gesture ends
                    SnapToNearestStep();
                    panX = rotation;
                    break;
            }
        }

        //Added snap to when the wheel stops moving

        private void SnapToNearestStep()
        {
            // Calculate the nearest rotation step
            double nearestStep = Math.Round(rotation / RotationStep) * RotationStep;

            // Adjust rotation and shift to the snapped value
            rotation = nearestStep;
            if (rotation >= FullRotation) rotation = 0; // Wraparound for full rotation
            shift = CalculateShiftFromRotation(rotation);

            UpdateRotation(rotation);
        }

        private int CalculateShiftFromRotation(double rotationValue)
        {
            return (int)((FullRotation - rotationValue) / RotationStep) % (MaxShift + 1);
        }

        private void UpdateRotation(double value)
        {
            bot.Rotation = value; // Update rotation
            Key.Text = $"Shift: {shift}";
        }

        private void ResetRotation()
        {
            rotation = FullRotation;
            shift = 0;
            UpdateRotation(rotation);
        }
    }
}
