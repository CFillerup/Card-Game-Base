using System.Text.Json.Serialization;

namespace MudBlazer2.Client.Models
{
    public class RoomCard : CardBase
    {
        public bool[] Doors { get; set; } = new bool[4]; // Top, Right, Bottom, Left
        public int EncounterChance { get; set; } = 0;
        public bool[][] Grid { get; set; } // Jagged array for room layout
        public int RoomWidth { get; set; }
        public int RoomHeight { get; set; }

        [JsonConstructor]
        public RoomCard(bool[] doors, int encounterChance, bool[][] grid, int roomWidth, int roomHeight)
        {
            Doors = doors;
            EncounterChance = encounterChance;
            Grid = grid;
            RoomWidth = roomWidth;
            RoomHeight = roomHeight;
        }

        public RoomCard() { }

        // Constructor to initialize a room with a grid size
        public RoomCard(int width, int height)
        {
            RoomWidth = width;
            RoomHeight = height;
            Grid = new bool[height][]; // Rows first

            for (int y = 0; y < height; y++)
            {
                Grid[y] = new bool[width]; // Each row contains 'width' columns
            }
        }

        // Helper method to access grid data safely
        public bool GetGridValue(int x, int y)
        {
            if (x < 0 || x >= RoomWidth || y < 0 || y >= RoomHeight)
                throw new ArgumentOutOfRangeException("Grid coordinates out of bounds");

            return Grid[y][x];
        }

        // Helper method to set a grid value
        public void SetGridValue(int x, int y, bool value)
        {
            if (x < 0 || x >= RoomWidth || y < 0 || y >= RoomHeight)
                throw new ArgumentOutOfRangeException("Grid coordinates out of bounds");

            Grid[y][x] = value;
        }
    }

}
