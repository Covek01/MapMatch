namespace MapMatchApi.DTOs
{
    public class GroupBasic
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? JoinCode { get; set; }
        public string? PreferedColor { get; set; } = null;
        public string? PhotoPath { get; set; } = null;
        public int AdminId { get; set; }

        public GroupBasic(Group g)
        {
            this.Id = g.Id;
            this.Name = g.Name;
            this.JoinCode = g.JoinCode;
            this.PreferedColor = g.PreferedColor;
            this.PhotoPath = g.PhotoPath == string.Empty || g.PhotoPath == null ? "./Images/default.jpg" : g.PhotoPath;
            this.AdminId = g.Admin.Id;
        }
        public GroupBasic()
        {

        }
    }
}
