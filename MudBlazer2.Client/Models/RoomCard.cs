namespace MudBlazer2.Client.Models
{
    public class RoomCard : CardBase
    {
        public bool TopDoor { get; set; }
        public bool RightDoor { get; set; }
        public bool BottomDoor { get; set; }
        public bool LeftDoor { get; set; }
        public int EncounterChance { get; set; } = 0;
        public int RoomWidth { get; set; }
        public int RoomDepth { get; set; }
        public int RoomHeight { get; set; }
    }
}
