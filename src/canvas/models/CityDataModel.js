const CITY_DATA = {


  //=====================================================================
  "Madagascar": [
    ["Antsiranana", 197.5963, -435.8698, false],
    ["Ambilobe", 178.9357, -376.7598, false],
    ["Maroantsetra", 212.7798, -238.0441, false],
    ["Marovoay", 5.7248, -200.723, false],
    ["Fenoarivo", 188.6881, -96.3469, false],
    ["Maintirano", -179.9083, -67.9249, false],
    ["Antananarivo", 55.5872, -1.8606, true],
    ["Belo Tsiribihina", -151.2018, 49.644, false],
    ["Ihosy", -50.5963, 239.6055, false],
    ["Toliara", -221.5229, 299.332, false],
    ["Farafagana", 57.5413, 272.633, false],
    ["Ambovombe", -57.6881, 436.2936, false],
  ],


  //=====================================================================
  'Brazil': [
    ['São Paulo', 200, 213, false],
    ['Rio de Janeiro', 281, 190, false],
    ['Brasília', 159, 14, true],
    ['Goiânia', 129, 39, false],
    ['Salvador', 382, -59, false],
    ['Belém', 139, -316, false],
    ['Manaus', -137, -278, false],
    ['Cuiabá', -33, 16, false],
    ['Porto Alegre', 99, 388, false],
    ['Fortaleza', 377, -257, false],
    ['Teresina', 271, -247, false],
    ['Marabá', 119, -234, false],
    ['Boa Vista', -143, -420, false],
    ['Rio Branco', -315, -108, false],
    ['Porto Velho', -221, -138, false],
  ],

  //=====================================================================
  'Australia': [
    ['Melbourne', 250, 247, false],
    ['Sydney', 385, 143, false],
    ['Brisbane', 424, -20, false],
    ['Cairns', 266, -260, false],
    ['Katherine', -24, -319, false],
    ['Boodarie', -317, -185, false],
    ['Perth', -380, 90, false],
    ['Adelaide', 110, 171, false],
    ['Alice Springs', 12, -106, false],
    ['Canberra', 340, 181, true],
  ],


  //=====================================================================
  'Bolivia': [
    ['Montero', 27, 37, false],
    ['Cochabamba', -120, 43, false],
    ['Oruro', -166, 73, false],
    ['La Paz', -219, -6, false],
    ['Sucre', -73, 127, true],
    ['Riberalta', -114, -288, false],
    ['Tarija', -48, 263, false],
    ['Uyuni', -153, 206, false],
    ['Trinidad', -56, -91, false],
    ['Chochís', 188, 83, false],
  ],


  //=====================================================================
  'Congo': [
    ['Kinshasa', -259, 10, true],
    ['Kikwit', -106, 40, false],
    ['Kananga', 57, 75, false],
    ['Mbuji-Mayi', 113, 87, false],
    ['Lubumbashi', 281, 336, false],
    ['Kasongo', 243, 13, false],
    ['Kisangani', 180, -207, false],
    ['Mambasa', 348, -246, false],
    ['Gemena', -60, -326, false],
    ['Mbandaka', -125, -184, false],
    ['Boende', -13, -173, false],
  ],


  //=====================================================================
  'Indonesia': [
    ['Jakarta', -223, 122, true],
    ['Jambi', -286, 34, false],
    ['Bukittinggi', -350, 8, false],
    ['Medan', -383, -69, false],
    ['Palangkaraya', -87, 44, false],
    ['Surabaya', -108, 143, false],
    ['Makassar', 25, 100, false],
    ['Timika', 363, 90, false],
    ['Manado', 127, -27, false],
    ['Tarakan', -17, -56, false],
    ['Kupang', 106, 197, false],
  ],


  //=====================================================================
  'Japan': [
    ['Sapporo', 168, -318, false],
    ['Sendai', 150, -71, false],
    ['Tokyo', 109, 55, true],
    ['Nagano', 46, 7, false],
    ['Nagoya', -3, 75, false],
    ['Osaka', -60, 102, false],
    ['Kochi', -137, 155, false],
    ['Kumamoto', -243, 191, false],
    ['Fukuoka', -256, 153, false],
    ['Okinawa', -354, 474, false],
    ['Niigata', 80, -52, false],
    ['Hiroshima', -175, 118, false],
    ['Kanazawa', -14, 13, false],
    ['Aomori', 144, -196, false],
  ],

  //=====================================================================
  'Myanmar': [
    ['Mandalay', -9, -108, false],
    ['Monywa', -44, -123, false],
    ['Magway', -59, -22, false],
    ['Naypyidaw', -3, -3, true],
    ['Yangon', -2, 132, false],
    ['Mawlamyine', 67, 142, false],
    ['Myeik', 107, 331, false],
    ['Keng Tung', 148, -80, false],
    ['Myitkyina', 48, -275, false],
    ['Lashio', 67, -157, false],
  ],

  //=====================================================================
  'Nigeria': [
    ['Abuja', -86, 7, true],
    ['Kano', -1, -204, false],
    ['Gombe', 182, -81, false],
    ['Maiduguri', 322, -193, false],
    ['Jimeta', 244, -22, false],
    ['Gboko', 26, 130, false],
    ['Benin City', -213, 203, false],
    ['Ibadan', -334, 128, false],
    ['Ilorin', -288, 47, false],
    ['Baguda', -311, -160, false],
    ['Gwadabawa', -239, -302, false],
    ['Kaduna', -80, -100, false],
    ['Port Harcourt', -114, 308, false],
  ],


  //=====================================================================
  'Tanzania': [
    ['Dodoma', 62, -14, true],
    ['Mbeya', -112, 195, false],
    ['Mwanza', -152, -291, false],
    ['Arusha', 134, -223, false],
    ['Morogoro', 208, 38, false],
    ['Songea', 54, 328, false],
    ['Mtwara', 395, 304, false],
    ['Iringa', 57, 110, false],
    ['Tabora', -158, -100, false],
    ['Geita', -207, -263, false],
    ['Bukoba', -239, -381, false],
    ['Sumbawanga', -253, 122, false],
    ['Dar es Salaam', 326, 34, false],
  ],


  //=====================================================================
  'Zimbabwe': [
    ['Harare', 162, -134, true],
    ['Bulawayo', -72, 100, false],
    ['Gweru', 44, 34, false],
    ['West Nicholson', 2, 198, false],
    ['Masvingo', 142, 94, false],
    ['Lupane', -152, -23, false],
    ['Gokwe', -39, -92, false],
    ['Karoi', 33, -236, false],
    ['Nyazura', 271, -45, false],
    ['Kotwa', 319, -215, false],
    ['Hwange', -271, -81, false],
  ],

}

export default CITY_DATA