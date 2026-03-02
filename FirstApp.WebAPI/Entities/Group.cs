using System.ComponentModel.DataAnnotations;

namespace FirstApp.WebAPI.Entities
{
    public class Group(string name)
    {
        [Key]
        public string Name { get; set; } = name;

        //Navigational Properties
        public ICollection<Connection> Connections { get; set; } = [];
    }
}
