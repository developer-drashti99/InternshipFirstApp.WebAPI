using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FirstApp.WebAPI.DTOs;
using FirstApp.WebAPI.Entities;

namespace FirstApp.WebAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.SenderDisplayName, opt => opt.MapFrom(src => src.Sender.DisplayName))
            .ForMember(dest=>dest.SenderImageUrl,opt=>opt.MapFrom(src=>src.Sender.ImageUrl))
            .ForMember(dest => dest.RecipientDisplayName, opt => opt.MapFrom(src => src.Recipient.DisplayName))
            .ForMember(dest=>dest.RecipientImageUrl,opt=>opt.MapFrom(src=>src.Recipient.ImageUrl));
        }
    }
}