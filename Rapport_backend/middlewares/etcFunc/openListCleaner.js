const openListCleaner = (openList) => {
  return new Promise((resolve) => {
    resolve(
      openList.map((obj) => {
        const reObj = {
          "id": obj.id,
          "CounselorProfile": obj.CounselorProfile,
          "startDate": obj.Open.startDate,
          "endDate": obj.Open.endDate,
          "Open": {
            "MON0": obj.Open.MON0, "MON1": obj.Open.MON1, "MON2": obj.Open.MON2, "MON3": obj.Open.MON3, "MON4": obj.Open.MON4, "MON5": obj.Open.MON5, "MON6": obj.Open.MON6, "MON7": obj.Open.MON7, "MON8": obj.Open.MON8, "MON9": obj.Open.MON9, "MON10": obj.Open.MON10, "MON11": obj.Open.MON11, "MON12": obj.Open.MON12, "MON13": obj.Open.MON13, "MON14": obj.Open.MON14, "MON15": obj.Open.MON15, "MON16": obj.Open.MON16, "MON17": obj.Open.MON17, "MON18": obj.Open.MON18, "MON19": obj.Open.MON19, "MON20": obj.Open.MON20, "MON21": obj.Open.MON21, "MON22": obj.Open.MON22, "MON23": obj.Open.MON23,
            "TUE0": obj.Open.TUE0, "TUE1": obj.Open.TUE1, "TUE2": obj.Open.TUE2, "TUE3": obj.Open.TUE3, "TUE4": obj.Open.TUE4, "TUE5": obj.Open.TUE5, "TUE6": obj.Open.TUE6, "TUE7": obj.Open.TUE7, "TUE8": obj.Open.TUE8, "TUE9": obj.Open.TUE9, "TUE10": obj.Open.TUE10, "TUE11": obj.Open.TUE11, "TUE12": obj.Open.TUE12, "TUE13": obj.Open.TUE13, "TUE14": obj.Open.TUE14, "TUE15": obj.Open.TUE15, "TUE16": obj.Open.TUE16, "TUE17": obj.Open.TUE17, "TUE18": obj.Open.TUE18, "TUE19": obj.Open.TUE19, "TUE20": obj.Open.TUE20, "TUE21": obj.Open.TUE21, "TUE22": obj.Open.TUE22, "TUE23": obj.Open.TUE23,
            "WED0": obj.Open.WED0, "WED1": obj.Open.WED1, "WED2": obj.Open.WED2, "WED3": obj.Open.WED3, "WED4": obj.Open.WED4, "WED5": obj.Open.WED5, "WED6": obj.Open.WED6, "WED7": obj.Open.WED7, "WED8": obj.Open.WED8, "WED9": obj.Open.WED9, "WED10": obj.Open.WED10, "WED11": obj.Open.WED11, "WED12": obj.Open.WED12, "WED13": obj.Open.WED13, "WED14": obj.Open.WED14, "WED15": obj.Open.WED15, "WED16": obj.Open.WED16, "WED17": obj.Open.WED17, "WED18": obj.Open.WED18, "WED19": obj.Open.WED19, "WED20": obj.Open.WED20, "WED21": obj.Open.WED21, "WED22": obj.Open.WED22, "WED23": obj.Open.WED23,
            "THU0": obj.Open.THU0, "THU1": obj.Open.THU1, "THU2": obj.Open.THU2, "THU3": obj.Open.THU3, "THU4": obj.Open.THU4, "THU5": obj.Open.THU5, "THU6": obj.Open.THU6, "THU7": obj.Open.THU7, "THU8": obj.Open.THU8, "THU9": obj.Open.THU9, "THU10": obj.Open.THU10, "THU11": obj.Open.THU11, "THU12": obj.Open.THU12, "THU13": obj.Open.THU13, "THU14": obj.Open.THU14, "THU15": obj.Open.THU15, "THU16": obj.Open.THU16, "THU17": obj.Open.THU17, "THU18": obj.Open.THU18, "THU19": obj.Open.THU19, "THU20": obj.Open.THU20, "THU21": obj.Open.THU21, "THU22": obj.Open.THU22, "THU23": obj.Open.THU23,
            "FRI0": obj.Open.FRI0, "FRI1": obj.Open.FRI1, "FRI2": obj.Open.FRI2, "FRI3": obj.Open.FRI3, "FRI4": obj.Open.FRI4, "FRI5": obj.Open.FRI5, "FRI6": obj.Open.FRI6, "FRI7": obj.Open.FRI7, "FRI8": obj.Open.FRI8, "FRI9": obj.Open.FRI9, "FRI10": obj.Open.FRI10, "FRI11": obj.Open.FRI11, "FRI12": obj.Open.FRI12, "FRI13": obj.Open.FRI13, "FRI14": obj.Open.FRI14, "FRI15": obj.Open.FRI15, "FRI16": obj.Open.FRI16, "FRI17": obj.Open.FRI17, "FRI18": obj.Open.FRI18, "FRI19": obj.Open.FRI19, "FRI20": obj.Open.FRI20, "FRI21": obj.Open.FRI21, "FRI22": obj.Open.FRI22, "FRI23": obj.Open.FRI23,
            "SAT0": obj.Open.SAT0, "SAT1": obj.Open.SAT1, "SAT2": obj.Open.SAT2, "SAT3": obj.Open.SAT3, "SAT4": obj.Open.SAT4, "SAT5": obj.Open.SAT5, "SAT6": obj.Open.SAT6, "SAT7": obj.Open.SAT7, "SAT8": obj.Open.SAT8, "SAT9": obj.Open.SAT9, "SAT10": obj.Open.SAT10, "SAT11": obj.Open.SAT11, "SAT12": obj.Open.SAT12, "SAT13": obj.Open.SAT13, "SAT14": obj.Open.SAT14, "SAT15": obj.Open.SAT15, "SAT16": obj.Open.SAT16, "SAT17": obj.Open.SAT17, "SAT18": obj.Open.SAT18, "SAT19": obj.Open.SAT19, "SAT20": obj.Open.SAT20, "SAT21": obj.Open.SAT21, "SAT22": obj.Open.SAT22, "SAT23": obj.Open.SAT23,
            "SUN0": obj.Open.SUN0, "SUN1": obj.Open.SUN1, "SUN2": obj.Open.SUN2, "SUN3": obj.Open.SUN3, "SUN4": obj.Open.SUN4, "SUN5": obj.Open.SUN5, "SUN6": obj.Open.SUN6, "SUN7": obj.Open.SUN7, "SUN8": obj.Open.SUN8, "SUN9": obj.Open.SUN9, "SUN10": obj.Open.SUN10, "SUN11": obj.Open.SUN11, "SUN12": obj.Open.SUN12, "SUN13": obj.Open.SUN13, "SUN14": obj.Open.SUN14, "SUN15": obj.Open.SUN15, "SUN16": obj.Open.SUN16, "SUN17": obj.Open.SUN17, "SUN18": obj.Open.SUN18, "SUN19": obj.Open.SUN19, "SUN20": obj.Open.SUN20, "SUN21": obj.Open.SUN21, "SUN22": obj.Open.SUN22, "SUN23": obj.Open.SUN23,
          }
        };
        
        return reObj;
      })
    )  
  })
};

module.exports = openListCleaner;