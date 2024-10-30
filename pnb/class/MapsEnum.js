class Maps {
    #name
    #id

    static CanyonColone = new Maps("Canyon aux colonnes", 1)
    static BanlieuBalibot = new Maps("Banlieue Balibot", 2)
    static MarcheGrefin = new Maps("Marché Grefin", 3)
    static ReservoirRigadelle = new Maps("Réservoir Rigadelle", 4)
    static PontEsturgeon = new Maps("Pont Esturgeon", 5)
    static GaleriesGuppy = new Maps("Galeries Guppy", 6)
    static ClubCashalot = new Maps("Club Ca$alot", 7)
    static InstitutCalamart = new Maps("Institut Calm'arts", 8)
    static ChantierNarval = new Maps("Chantier Narval", 9)
    static SupermarcherCetace = new Maps("Supermarché Cétacé", 10)
    static ParcCarapince = new Maps("Parc Carapince", 11)
    static LostissementFilament = new Maps("Lotissement Filament", 12)
    static SourcesSauret = new Maps("Sources Sauret", 13)
    static MantaMaria = new Maps("Manta Maria", 14)
    static RuinesUmami = new Maps("Ruines Uma'mi", 15)
    static PisteMeroule = new Maps("Piste Méroule", 16)
    static HallesPortmerlu = new Maps("Halles de Port-merlu", 17)
    static QuartierCrabe = new Maps("Quartier Crabe-ciels", 18)
    static ChalentFeltan = new Maps("Chalant Flétan", 19)
    static MineMarine = new Maps("Mine Marine", 20)
    static AreneMecaramen = new Maps("Arène Méca-ramen", 21)
    static TerminalRorqual = new Maps("Terminal Rorqual", 22)
    static GareAiguillat = new Maps("Gare Aiguillat", 23)

    constructor(name, id){
        this.#name = name
        this.#id = id
    }

    get getName(){
        return this.#name
    }

    get getId(){
        return this.#id
    }
}

module.export = {
    Maps
}