/**
 * Mapeo completo de thumbnails para todos los tipos de geodas
 * IMPORTANTE: Ordenados por Base Mining Power para coincidir con minerIndex del contrato
 * ⚠️ NO ordenar alfabéticamente - el índice del array DEBE coincidir con minerIndex on-chain
 */

export const thumbnailNames: Record<string, string[]> = {
  // PETIT_AQUA - Ordenados por Base Mining Power
  'PETIT_AQUA': [
    'GOTA_RAPIDA-thumbnail.webp',                  // Power: 50 (minerIndex 0)
    'CORRIENTE_LIGERA-thumbnail.webp',             // Power: 60 (minerIndex 1)
    'BURBUJA_EFICIENTE-thumbnail.webp',            // Power: 70 (minerIndex 2)
    'CHORRO_PRECISO-thumbnail.webp',               // Power: 80 (minerIndex 3)
    'FLUJO_SERENO-thumbnail.webp',                 // Power: 90 (minerIndex 4)
    'GOTA_DE_ROCIO-thumbnail.webp',                // Power: 100 (minerIndex 5)
    'CORRIENTE_DE_TSUNAMI-thumbnail.webp',         // Power: 500 (minerIndex 6)
  ],

  // PETIT_BEAST - Ordenados por Base Mining Power
  'PETIT_BEAST': [
    'CACHORRO_AGIL-thumbnail.webp',                // Power: 50 (minerIndex 0)
    'RASTREADOR_TENAZ-thumbnail.webp',             // Power: 60 (minerIndex 1)
    'CAZADOR_JOVEN-thumbnail.webp',                // Power: 70 (minerIndex 2)
    'GARRA_IMPACIENTE-thumbnail.webp',             // Power: 80 (minerIndex 3)
    'CRIA_FEROZ-thumbnail.webp',                   // Power: 90 (minerIndex 4)
    'EXPLORADOR_AUDAZ-thumbnail.webp',             // Power: 100 (minerIndex 5)
    'CACHORRO_ALFA-thumbnail.webp',                // Power: 500 (minerIndex 6)
  ],

  // PETIT_BIRD - Ordenados por Base Mining Power
  'PETIT_BIRD': [
    'ALA_VELOZ-thumbnail.webp',                    // Power: 50 (minerIndex 0)
    'CORRIENTE_ASCENDENTE-thumbnail.webp',         // Power: 60 (minerIndex 1)
    'PLUMA_LIGERA-thumbnail.webp',                 // Power: 70 (minerIndex 2)
    'PICOTAZO_PRECISO-thumbnail.webp',             // Power: 80 (minerIndex 3)
    'PEQUENO_RAPTOR-thumbnail.webp',               // Power: 90 (minerIndex 4)
    'POLLUELO_VIGIA-thumbnail.webp',               // Power: 100 (minerIndex 5)
    'GORRION_SONICO-thumbnail.webp',               // Power: 500 (minerIndex 6)
  ],

  // PETIT_BUG - Ordenados por Base Mining Power
  'PETIT_BUG': [
    'ZANGANO_OBRERO-thumbnail.webp',               // Power: 50 (minerIndex 0)
    'HORMIGA_EXPLORADORA-thumbnail.webp',          // Power: 60 (minerIndex 1)
    'PUPA_EFICIENTE-thumbnail.webp',               // Power: 70 (minerIndex 2)
    'ZUMBIDO_SILENCIOSO-thumbnail.webp',           // Power: 80 (minerIndex 3)
    'ESCARABAJO_RESILIENTE-thumbnail.webp',        // Power: 90 (minerIndex 4)
    'LARVA_PROTEGIDA-thumbnail.webp',              // Power: 100 (minerIndex 5)
    'ZANGANO_REINA-thumbnail.webp',                // Power: 500 (minerIndex 6)
  ],

  // PETIT_DAWN - Ordenados por Base Mining Power
  'PETIT_DAWN': [
    'RAYO_DEL_SOL-thumbnail.webp',                 // Power: 50 (minerIndex 0)
    'VIGIA_DEL_ALBA-thumbnail.webp',               // Power: 60 (minerIndex 1)
    'LUZ_PURA-thumbnail.webp',                     // Power: 70 (minerIndex 2)
    'DESTELLO_PRECISO-thumbnail.webp',             // Power: 80 (minerIndex 3)
    'CLARIDAD_CONSTANTE-thumbnail.webp',           // Power: 90 (minerIndex 4)
    'GOTA_DE_ROCIO-thumbnail.webp',                // Power: 100 (minerIndex 5)
    'CHISPA_DEL_SOL-thumbnail.webp',               // Power: 500 (minerIndex 6)
  ],

  // PETIT_DUSK - Ordenados por Base Mining Power
  'PETIT_DUSK': [
    'SUSURRO_NOCTURNO-thumbnail.webp',             // Power: 50 (minerIndex 0)
    'ESPIA_CREPUSCULAR-thumbnail.webp',            // Power: 60 (minerIndex 1)
    'BRILLO_EFIMERO-thumbnail.webp',               // Power: 70 (minerIndex 2)
    'DAGA_DE_SOMBRA-thumbnail.webp',               // Power: 80 (minerIndex 3)
    'PENUMBRA_CONSTANTE-thumbnail.webp',           // Power: 90 (minerIndex 4)
    'CRIA_DEL_OCASO-thumbnail.webp',               // Power: 100 (minerIndex 5)
    'SOMBRA_ASECHANTE-thumbnail.webp',             // Power: 500 (minerIndex 6)
  ],

  // PETIT_MECH - Ordenados por Base Mining Power
  'PETIT_MECH': [
    'NANO_CONSTRUCTOR-thumbnail.webp',             // Power: 50 (minerIndex 0)
    'DRON_DE_PROSPECCION-thumbnail.webp',          // Power: 60 (minerIndex 1)
    'PEQUENO_LOBO-thumbnail.webp',                 // Power: 70 (minerIndex 2)
    'CHISPA_PRECISA-thumbnail.webp',               // Power: 80 (minerIndex 3)
    'CIRCUITO_ESTABLE-thumbnail.webp',             // Power: 90 (minerIndex 4)
    'TORNILLO_DE_TITANIO-thumbnail.webp',          // Power: 100 (minerIndex 5)
    'NANO_CONSTRUCTOR_ALFA-thumbnail.webp',        // Power: 500 (minerIndex 6)
  ],

  // PETIT_PLANT - Ordenados por Base Mining Power
  'PETIT_PLANT': [
    'BROTE_CONSTANTE-thumbnail.webp',              // Power: 50 (minerIndex 0)
    'RAIZ_JOVEN-thumbnail.webp',                   // Power: 60 (minerIndex 1)
    'HOJA_PERENNE-thumbnail.webp',                 // Power: 70 (minerIndex 2)
    'ESPINA_AFILADA-thumbnail.webp',               // Power: 80 (minerIndex 3)
    'FLUJO_DE_SAVIA-thumbnail.webp',               // Power: 90 (minerIndex 4)
    'SEMILLA_DURMIENTE-thumbnail.webp',            // Power: 100 (minerIndex 5)
    'BROTE_MILENARIO-thumbnail.webp',              // Power: 500 (minerIndex 6)
  ],
  // ALTO AQUA
  'ALTO_AQUA': [
    'CORRIENTE_RESTAURADORA-thumbnail.webp',
    'MAREA_CRECIENTE-thumbnail.webp',
    'MAREA_SANADORA-thumbnail.webp',
    'OLA_VIGOROSA-thumbnail.webp',
    'PULSO_OCEANICO-thumbnail.webp',
    'REA_CURATIVA-thumbnail.webp',
    'REMOLINO_CONSTANTE-thumbnail.webp',
  ],
  // ALTO BIRD
  'ALTO_BIRD': [
    'CANTO_DEL_VIENTO-thumbnail.webp',
    'CASADOR_SOLITARIO-thumbnail.webp',
    'EXPLORADOR_DEL_CIELO-thumbnail.webp',
    'HARPIA_REAL-thumbnail.webp',
    'NIDO_SEGURO-thumbnail.webp',
    'OJO_DE_ALCON-thumbnail.webp',
    'SEMIPLUMAS-thumbnail.webp',
  ],
  // ALTO BUG
  'ALTO_BUG': [
    'AVISPA_ASESINA-thumbnail.webp',
    'AVISPA_SOLDADO-thumbnail.webp',
    'GUARDIAN_DEL_NIDO-thumbnail.webp',
    'INSECTO_VETERANO-thumbnail.webp',
    'LADY_BUG-thumbnail.webp',
    'MANDIBULA_AFILADA-thumbnail.webp',
    'ZUMBIDO_POTENTE-thumbnail.webp',
  ],
  // ALTO DUSK
  'ALTO_DUSK': [
    'ASECHADOR_SILECIOSO-thumbnail.webp',
    'DUSK_VETERANO-thumbnail.webp',
    'FILO_DEL_ABISMO-thumbnail.webp',
    'LADRON_DE_ECOS-thumbnail.webp',
    'PASO_SOMBIO-thumbnail.webp',
    'RELAMPAGO_DE_SOMBRA-thumbnail.webp',
    'RUTUAL_SECRETO-thumbnail.webp',
  ],
  // ALTO MECH
  'ALTO_MECH': [
    'AUTOMATA_DE_COMBATE-thumbnail.webp',
    'CHIP_DE_AHORRO-thumbnail.webp',
    'MECH_VETERANO-thumbnail.webp',
    'PROCESADOR_SUPER_CUANTICO-thumbnail.webp',
    'SINTETIZADOR_DE_ALIACIONES-thumbnail.webp',
    'SOBRECARGA_CONTROLADA-thumbnail.webp',
    'UNIDAD_DE_PROCESAMIENTO-thumbnail.webp',
  ],
  // ALTO PLANT
  'ALTO_PLANT': [
    'ARBOL_VETERANO-thumbnail.webp',
    'GUARDIAN_DEL_BOSQUE-thumbnail.webp',
    'HOJA_ENERGETICA-thumbnail.webp',
    'HOJA_GIGANTE-thumbnail.webp',
    'PLANTA_CARNIVORA-thumbnail.webp',
    'RAIZ_PROFUNDA-thumbnail.webp',
    'SAVIA_CURATIVA-thumbnail.webp',
  ],
  // ALTO REPTILE
  'ALTO_REPTILE': [
    'DEPREDADOR_SIGILOSO-thumbnail.webp',
    'DIAMANTE_BLINDADO-thumbnail.webp',
    'ESCAMA_PULIDA-thumbnail.webp',
    'GUARDIAN_SILENCIOSO-thumbnail.webp',
    'LAGARTO_INSACIABLE-thumbnail.webp',
    'MITRADA_HIPNOTICA-thumbnail.webp',
    'REPTIL_VETERANO-thumbnail.webp',
  ],
  // ANIMAL AQUA
  'ANIMAL_AQUA': [
    'AXOLOTL_MARINO-thumbnail.webp',
    'CORRIENTE_SALVAJE-thumbnail.webp',
    'MAREA_VELOZ-thumbnail.webp',
    'OCEANO_PROFUNDO-thumbnail.webp',
    'SEÑOR_DE_LAS_MAREAS-thumbnail.webp',
    'TORMENTA_IMPARABLE-thumbnail.webp',
    'TSUNAMI_CONTROLADO-thumbnail.webp',
  ],
  // ANIMAL BIRD
  'ANIMAL_BIRD': [
    'ATALAYA-thumbnail.webp',
    'BUBO_BUBO-thumbnail.webp',
    'CORAZON_DE_CONDOR-thumbnail.webp',
    'CORRIENTE_CONTROLADA-thumbnail.webp',
    'INSTINTO_CASADOR-thumbnail.webp',
    'REY_DE_LOS_CIELOS-thumbnail.webp',
    'VUELO_RASANTE-thumbnail.webp',
  ],
  // ANIMAL BUG
  'ANIMAL_BUG': [
    'INSTINTO_PARACITARIO-thumbnail.webp',
    'MANTIS_REINA-thumbnail.webp',
    'POLILLA_BOGÓN-thumbnail.webp',
    'PULGA_ELECTRONICA-thumbnail.webp',
    'PULGON_LANUDO-thumbnail.webp',
    'TERMITA_BIOLUMINICENTE-thumbnail.webp',
    'TIJERETA_NINFA-thumbnail.webp',
  ],
  // ANIMAL DUSK
  'ANIMAL_DUSK': [
    'CORAZON_SOMBRIO-thumbnail.webp',
    'DEVORADOR_DE_LUZ-thumbnail.webp',
    'INSTINTO_NOCTURNO-thumbnail.webp',
    'INTRIGA_CONTROLADA-thumbnail.webp',
    'PESADILLA_VIVIENTE-thumbnail.webp',
    'QUIMERA_DEL_ABISMO-thumbnail.webp',
    'TERROR_NOCTURNO-thumbnail.webp',
  ],
  // ANIMAL MECH
  'ANIMAL_MECH': [
    'CAÑON_DE_RIELES-thumbnail.webp',
    'CENTINELA_DE_GUERRA-thumbnail.webp',
    'CORAZON_DE_ACERO-thumbnail.webp',
    'DESTRUCTOR_IMPARABLE-thumbnail.webp',
    'INSTINTO_DE_COMBATE-thumbnail.webp',
    'MAQUINA_DE_GUERRA-thumbnail.webp',
    'PILOTO_AUTOMATICO-thumbnail.webp',
  ],
  // ANIMAL PLANT
  'ANIMAL_PLANT': [
    'ARMONIA_NATURAL-thumbnail.webp',
    'AVATAR_DEL_BOSQUE-thumbnail.webp',
    'CORAZON_DE_ROBLE-thumbnail.webp',
    'ESPIRITU_DEL_BOSQUE-thumbnail.webp',
    'GNOMO_DEL_SANTUARIO-thumbnail.webp',
    'INSTINTO_SIMBIOTICO-thumbnail.webp',
    'SINERGIA_FORESTAL-thumbnail.webp',
  ],
  // ANIMAL REPTILE
  'ANIMAL_REPTILE': [
    'BASILISCO_EMPERADOR-thumbnail.webp',
    'DRAGAN_PURPURA-thumbnail.webp',
    'FURIA_CONTROLADA-thumbnail.webp',
    'FURIA_ESCAMOSA-thumbnail.webp',
    'FURIA_VENENOSA-thumbnail.webp',
    'INSTINTO_DEPREDADOR-thumbnail.webp',
  ],
  // PETIT AQUA
  'PETIT_AQUA': [
    'BURBUJA_EFICIENTE-thumbnail.webp',
    'CHORRO_PRECISO-thumbnail.webp',
    'CORRIENTE_DE_TSUNAMI-thumbnail.webp',
    'CORRIENTE_LIGERA-thumbnail.webp',
    'FLUJO_SERENO-thumbnail.webp',
    'GOTA_DE_ROCIO-thumbnail.webp',
    'GOTA_RAPIDA-thumbnail.webp',
  ],
  // PETIT BEAST
  'PETIT_BEAST': [
    'CACHORRO_AGIL-thumbnail.webp',
    'CACHORRO_ALFA-thumbnail.webp',
    'CAZADOR_JOVEN-thumbnail.webp',
    'CRIA_FEROZ-thumbnail.webp',
    'EXPLORADOR_AUDAZ-thumbnail.webp',
    'GARRA_IMPACIENTE-thumbnail.webp',
    'RESTREADOR_TENAZ-thumbnail.webp',
  ],
  // PETIT BIRD
  'PETIT_BIRD': [
    'ALA_VELOZ-thumbnail.webp',
    'CORRIENTE_ASCENDENTE-thumbnail.webp',
    'GORRION_SONICO-thumbnail.webp',
    'PEQUEÑO_RAPTOR-thumbnail.webp',
    'PICOTAZO_PRECISO-thumbnail.webp',
    'PLUMA_LIGERA-thumbnail.webp',
    'POLLUELO_VIGIA-thumbnail.webp',
  ],
  // PETIT BUG
  'PETIT_BUG': [
    'ESCARABAJO_RESILIENTE-thumbnail.webp',
    'HORMIGA_EXPLORADORA-thumbnail.webp',
    'LARVA_PROTEGIDA-thumbnail.webp',
    'PUPA_EFICIENTE-thumbnail.webp',
    'ZANGANO_OBRERO-thumbnail.webp',
    'ZANGANO_REINA-thumbnail.webp',
    'ZUMBIDO_SILENCIOSO-thumbnail.webp',
  ],
  // PETIT DUSK
  'PETIT_DUSK': [
    'BRILLO_AFIMERO-thumbnail.webp',
    'CRIA_DEL_OCASO-thumbnail.webp',
    'DAGA_DE_SOMBRA-thumbnail.webp',
    'ESPIA_CREPUSCULAR-thumbnail.webp',
    'PENUMBRA_CONSTANTE-thumbnail.webp',
    'SOMBRA_ASECHANTE-thumbnail.webp',
    'SUSURRO_NOCTURNO-thumbnail.webp',
  ],
  // PETIT DAWN
  'PETIT_DAWN': [
    'CHISPA_DEL_SOL-thumbnail.webp',
    'CLARIDAD_CONSTANTE-thumbnail.webp',
    'DESTELLO_PRECISO-thumbnail.webp',
    'GOTA_DE_ROCIO-thumbnail.webp',
    'LUZ_PURA-thumbnail.webp',
    'RAYO_DEL_SOL-thumbnail.webp',
    'VIGIA_DEL_ALBA-thumbnail.webp',
  ],
  // PETIT MECH
  'PETIT_MECH': [
    'CHISPA_PRECISA-thumbnail.webp',
    'CIRCUITO_ESTABLE-thumbnail.webp',
    'DRON_DE_PROSPECCION-thumbnail.webp',
    'NANO_CONSTRUCTOR-thumbnail.webp',
    'NANO_CONSTRUCTOR_ALFA-thumbnail.webp',
    'NUCLEO_DE_TITANEO-thumbnail.webp',
    'PEQUEÑO_LOBO-thumbnail.webp',
  ],
  // PETIT PLANT
  'PETIT_PLANT': [
    'BROTE_CONSTANTE-thumbnail.webp',
    'BROTE_MILENARIO-thumbnail.webp',
    'ESPINA_AFILADA-thumbnail.webp',
    'FLUJO_DE_SAVIA-thumbnail.webp',
    'HOJA_PERENNE-thumbnail.webp',
    'REY_JOVEN-thumbnail.webp',
    'SEMILLA_DURMIENTE-thumbnail.webp',
  ],
  // PETIT REPTILE - Ordenados por Base Mining Power (50→60→70→80→90→100→500)
  'PETIT_REPTILE': [
    'ESCAMA_VENENOSA-thumbnail.webp',      // Power: 50 (minerIndex 0)
    'GECKO_ASTUTO-thumbnail.webp',         // Power: 60 (minerIndex 1)
    'ESCUDO_RESVALADIZO-thumbnail.webp',   // Power: 70 (minerIndex 2)
    'MORDIDA_RAPIDA-thumbnail.webp',       // Power: 80 (minerIndex 3)
    'SANGRE_FRIA-thumbnail.webp',          // Power: 90 (minerIndex 4)
    'CRIA_DE_CAIMAN-thumbnail.webp',       // Power: 100 (minerIndex 5)
    'CAIMAN_SOBERANO-thumbnail.webp',      // Power: 500 (minerIndex 6)
  ],
  // TANK AQUA
  'TANK_AQUA': [
    'ANTIGUO_CRISTATUS-thumbnail.webp',
    'CAPARAZON_DE_ACERO-thumbnail.webp',
    'CONCHA_REFORZADA-thumbnail.webp',
    'KRAKEN_RESISTENTE-thumbnail.webp',
    'LEVIATAN_ANCLADO-thumbnail.webp',
    'TRIDENTE_GUARDIAN-thumbnail.webp',
    'VIGILANTE_ABISAL-thumbnail.webp',
  ],
  // TANK BIRD
  'TANK_BIRD': [
    'ALBATROS_IMPLACABLE-thumbnail.webp',
    'CONDOR_IMPERIAL-thumbnail.webp',
    'DEPREDADOR_ALFA-thumbnail.webp',
    'GRIFO_ACORAZADO-thumbnail.webp',
    'HURACAN_BLINDADO-thumbnail.webp',
    'PICO_DE_ACERO-thumbnail.webp',
    'ROC_DE_MONTAÑA-thumbnail.webp',
  ],
  // TANK BUG
  'TANK_BUG': [
    'CARAPACHO_DE_ACERO-thumbnail.webp',
    'CARAPACHO_DE_DIAMANTE-thumbnail.webp',
    'CIERVO_VOANTE_IMPLCABLE-thumbnail.webp',
    'HORMIGA_LEGIONARIA-thumbnail.webp',
    'PIOJO_MUTANTE-thumbnail.webp',
    'PSYCO_TANQUE-thumbnail.webp',
    'PULGA_HERCULES-thumbnail.webp',
  ],
  // TANK DUSK
  'TANK_DUSK': [
    'BEHEMOTH_SOMBRIO-thumbnail.webp',
    'ESCUDO_DE_VACIO-thumbnail.webp',
    'GARGOLA_DE_PIEDRA-thumbnail.webp',
    'GUARDIAN_DEL_ECLIPSE-thumbnail.webp',
    'GUARDIAN_DEL_ECLIPSE_II-thumbnail.webp',
    'NEMESIS_FINAL-thumbnail.webp',
    'SEÑOR_DEL_TERROR-thumbnail.webp',
  ],
  // TANK MECH
  'TANK_MECH': [
    'BUNQUER_DEL_MINERO-thumbnail.webp',
    'BUNQUER_SOBERANO-thumbnail.webp',
    'COLOSO_DE_GUERRA-thumbnail.webp',
    'PLACAS_DE_TUNSTENO-thumbnail.webp',
    'SILVER_WOLF-thumbnail.webp',
    'TITAN_GUARDIAN-thumbnail.webp',
    'UNIDAD_JUGGERNAUT-thumbnail.webp',
  ],
  // TANK PLANT
  'TANK_PLANT': [
    'AXIS_MUNDI-thumbnail.webp',
    'ENT_INPLACABLE-thumbnail.webp',
    'ESPIRITU_PETRIFICADO-thumbnail.webp',
    'GUARDIAN_DEL_MUNDO-thumbnail.webp',
    'GUARDIAN_MILENARIO-thumbnail.webp',
    'MADERA_DE_HIERRO-thumbnail.webp',
    'SEMILLA_DE_SECUOIA-thumbnail.webp',
  ],
  // TANK REPTILE
  'TANK_REPTILE': [
    'ANQUILOSAURIO_ACORASADO-thumbnail.webp',
    'CAPARAZON_DE_OBSIDIANA-thumbnail.webp',
    'COCODRILO_GUARDIAN-thumbnail.webp',
    'DRAGON_DE_COMODO-thumbnail.webp',
    'TORTUGA_DE_GUERRA-thumbnail.webp',
    'TORTUGA_DE_GUERRA_LEGENDARIA-thumbnail.webp',
    'V-RAPTOR_ALFA-thumbnail.webp',
  ],
  // ULTRA AQUA
  'ULTRA_AQUA': [
    'CONSTRUCTOR_CORALIDO-thumbnail.webp',
    'GENERADOR_DE_MAREAS-thumbnail.webp',
    'NAVEGANTE_DE_PRECISION-thumbnail.webp',
    'NAVEMANTE_CIBERNETICO_MK_II-thumbnail.webp',
    'SONDA_OCEANICA-thumbnail.webp',
    'SUBMARINO_BLINDADO-thumbnail.webp',
    'TURBINA_IMPULSORA-thumbnail.webp',
  ],
  // ULTRA BIRD
  'ULTRA_BIRD': [
    'ALAS_DE_ACERO-thumbnail.webp',
    'ALMA_DE_CUPIDO-thumbnail.webp',
    'CAZADOR_FURTIVO_MK_II-thumbnail.webp',
    'HIBRIDO_KAKAPO-thumbnail.webp',
    'OTUS_MINERALIS-thumbnail.webp',
    'PLUMA_IMPLACABLE-X-thumbnail.webp',
    'PROPULSOR_SONICO-thumbnail.webp',
  ],
  // ULTRA BUG
  'ULTRA_BUG': [
    'AUTOMATA_RECOLECTOR-thumbnail.webp',
    'DRAGONFLY-thumbnail.webp',
    'ESCARABAJO_MECANIZADO_MK_II-thumbnail.webp',
    'EXOESQUELETO_MECANIZADO-thumbnail.webp',
    'INSECTO_X-thumbnail.webp',
    'PROTOTIPO_DE_ALMACENAMIENTO-thumbnail.webp',
    'QUIMERA_QUITINIZADA-thumbnail.webp',
  ],
  // ULTRA DUSK
  'ULTRA_DUSK': [
    'AUTOMATA_NOCTURNO-thumbnail.webp',
    'EXO-GARRA_SOMBRIA-thumbnail.webp',
    'MOTOR_DEL_VACIO-thumbnail.webp',
    'MOTOR_DEL_VACIO_MK_II-thumbnail.webp',
    'PROTOTIPO_SILENCIOSO-thumbnail.webp',
    'QUIMERA_DE_OBSIDIANA-thumbnail.webp',
    'SOMBRA-X-thumbnail.webp',
  ],
  // ULTRA MECH
  'ULTRA_MECH': [
    'AUTOMATA_SUPREMO-thumbnail.webp',
    'CIRCUITO_MOVIL-thumbnail.webp',
    'GIGA_FACTORIA_MK_II-thumbnail.webp',
    'GOLIATH-X-thumbnail.webp',
    'PISTON_DE_PLASMA-thumbnail.webp',
    'PROTOTIPO_DE_ENSAMBLAJE-thumbnail.webp',
    'QUIMERA_DE_ADAMANTINO-thumbnail.webp',
  ],
  // ULTRA PLANT
  'ULTRA_PLANT': [
    'AUTOMATA_JARDINERO-thumbnail.webp',
    'BATERIA_NATURAL-thumbnail.webp',
    'BIO-LASER_PRECISO-thumbnail.webp',
    'CULTIVADOR-X-thumbnail.webp',
    'INVERNADERO_BIONICO_MK_II-thumbnail.webp',
    'PANEL_SOLAR_ORGANICO-thumbnail.webp',
    'QUIMERA_BOTANICA-thumbnail.webp',
  ],
  // ULTRA REPTILE
  'ULTRA_REPTILE': [
    'AUTOMATA_SIGILOSO-thumbnail.webp',
    'CAMALEON_ADAPTATIVO_MK_II-thumbnail.webp',
    'DEPREDADOR_CIBERNETICO-thumbnail.webp',
    'ESCAMA_MECANIZADA-thumbnail.webp',
    'EXO-COLA_PRECISA-thumbnail.webp',
    'PROTOTIPO_CAMALEONICO-thumbnail.webp',
    'QUIMERA_DE_TITANEO-thumbnail.webp',
  ],
};
