#!/usr/bin/env python3
"""
Generates 6 JSON data files matching DataGenSpec v2.
Output: realmanage-identity-demo/data/*.json
Run:    PYTHONUNBUFFERED=1 python3 generate.py
"""
import json, random, pathlib, hashlib

OUT = pathlib.Path(__file__).parent / 'data'
OUT.mkdir(exist_ok=True)

def seed(s):
    """Deterministic seed from a string."""
    return int(hashlib.md5(s.encode()).hexdigest(), 16) % (2**32)

def write(name, records):
    p = OUT / name
    p.write_text(json.dumps({'records': records}, indent=2))
    print(f'  {name}: {len(records):,} records')

# ── Communities (54 total) ──────────────────────────────────────────────────
COMMUNITIES_EXISTING = [
    # TX (14)
    ('C001','Lakewood Estates HOA','TX','Plano',620),
    ('C002','Cypress Ridge Community Association','TX','Austin',480),
    ('C003','Pecan Grove HOA','TX','Houston',390),
    ('C004','Stone Creek Estates','TX','Dallas',510),
    ('C005','Mesquite Springs HOA','TX','Frisco',330),
    ('C006','Willow Bend HOA','TX','Southlake',270),
    ('C007','Oak Hollow Estates','TX','McKinney',440),
    ('C008','Bluebonnet Ridge HOA','TX','Round Rock',310),
    ('C009','Cedar Bluff Community Association','TX','Georgetown',290),
    ('C010','Longhorn Estates HOA','TX','Kyle',260),
    ('C011','Mockingbird Hills HOA','TX','Allen',240),
    ('C012','Prairie Wind Estates','TX','Leander',210),
    ('C013','Rio Vista HOA','TX','San Antonio',380),
    ('C014','Sunset Ridge Community Association','TX','Pflugerville',200),
    # AZ (10)
    ('C015','Saguaro Flats HOA','AZ','Scottsdale',720),
    ('C016','Desert Ridge Community Association','AZ','Phoenix',640),
    ('C017','Sonoran Estates HOA','AZ','Chandler',490),
    ('C018','Camelback Heights HOA','AZ','Tempe',420),
    ('C019','Copper Canyon Estates','AZ','Gilbert',380),
    ('C020','Mesa Vista HOA','AZ','Mesa',350),
    ('C021','Palo Verde Community Association','AZ','Glendale',300),
    ('C022','Ironwood Ridge HOA','AZ','Peoria',280),
    ('C023','Scottsdale Reserve','AZ','Scottsdale',560),
    ('C024','Superstition Foothills HOA','AZ','Apache Junction',240),
    # FL (7)
    ('C025','Palm Cove Community Association','FL','Tampa',460),
    ('C026','Cypress Bay HOA','FL','Orlando',390),
    ('C027','Pelican Shores Estates','FL','Naples',320),
    ('C028','Magnolia Grove HOA','FL','Jacksonville',280),
    ('C029','Sawgrass Pointe HOA','FL','Boca Raton',410),
    ('C030','Coral Pines Community Association','FL','Fort Lauderdale',350),
    ('C031','Suncoast Estates HOA','FL','Sarasota',290),
    # CA (5)
    ('C032','Pacific Ridge HOA','CA','San Diego',480),
    ('C033','Mira Vista Community Association','CA','Irvine',430),
    ('C034','Laurel Canyon Estates','CA','Los Angeles',380),
    ('C035','Redwood Bluff HOA','CA','San Jose',320),
    ('C036','Oakhurst Community Association','CA','Sacramento',290),
    # CO (3)
    ('C037','Summit Pines HOA','CO','Denver',210),
    ('C038','Eagle Ridge Community Association','CO','Boulder',180),
    ('C039','Aspen Creek Estates','CO','Colorado Springs',160),
    # NC (3)
    ('C040','Piedmont Glen HOA','NC','Charlotte',240),
    ('C041','Carolinas Reserve Community Association','NC','Raleigh',210),
    ('C042','Magnolia Crest Estates','NC','Durham',190),
    # GA (2)
    ('C043','Peachtree Ridge HOA','GA','Atlanta',310),
    ('C044','Chattahoochee Bluff Community Association','GA','Marietta',260),
    # NV (1)
    ('C045','Desert Canyon HOA','NV','Las Vegas',380),
    # WA (1)
    ('C046','Cascade Ridge Community Association','WA','Seattle',280),
]

COMMUNITIES_SUMMIT = [
    ('C047','Lone Star Ranch HOA','TX','Waco',340,'summit_ridge'),
    ('C048','Trinity Bend Estates','TX','Denton',290,'summit_ridge'),
    ('C049','Brazos Ridge Community Association','TX','Abilene',260,'summit_ridge'),
    ('C050','Texan Oaks HOA','TX','Lubbock',220,'summit_ridge'),
    ('C051','Sonoran Summit HOA','AZ','Tucson',310,'summit_ridge'),
    ('C052','Copper Mesa Estates','AZ','Surprise',270,'summit_ridge'),
    ('C053','Emerald Coast HOA','FL','Pensacola',240,'summit_ridge'),
    ('C054','Rockies Crest Community Association','CO','Fort Collins',190,'summit_ridge'),
]

communities = [
    {'community_id':c[0],'community_name':c[1],'state':c[2],'city':c[3],
     'unit_count':c[4],'manager_name':f'Manager {c[0]}','source':'existing'}
    for c in COMMUNITIES_EXISTING
] + [
    {'community_id':c[0],'community_name':c[1],'state':c[2],'city':c[3],
     'unit_count':c[4],'manager_name':f'Manager {c[0]}','source':c[5]}
    for c in COMMUNITIES_SUMMIT
]
write('communities.json', communities)

# ── Integration pipeline (3 hardcoded rows) ─────────────────────────────────
pipeline = [
    {'name':'Summit Ridge Management','close_date':'2026-04-15','total_records':12847,
     'matched_pct':88,'exceptions_remaining':1483,'status':'in_progress','days_to_live':14},
    {'name':'Coastal HOA Partners','close_date':'2026-02-28','total_records':4210,
     'matched_pct':94,'exceptions_remaining':0,'status':'complete','days_to_live':None},
    {'name':'Blue Ridge Realty Group','close_date':'2026-05-20','total_records':8332,
     'matched_pct':61,'exceptions_remaining':3249,'status':'at_risk','days_to_live':42},
]
write('integration_pipeline.json', pipeline)

# ── Collections risk (318 entities, top 25 hardcoded, rest generated) ────────
TOP25 = [
    ('Entity #0047',3,2,18200,'Collections'),
    ('Entity #0112',2,2,15400,'Collections'),
    ('Entity #0033',4,1,14100,'Collections'),
    ('Entity #0289',2,1,12700,'Collections'),
    ('Entity #0076',3,2,11500,'Collections'),
    ('Entity #0441',2,1,10200,'Delinquent 90+'),
    ('Entity #0198',3,2, 9800,'Collections'),
    ('Entity #0055',2,1, 8600,'Collections'),
    ('Entity #0322',2,2, 7900,'Delinquent 90+'),
    ('Entity #0011',3,1, 7100,'Collections'),
    ('Entity #0167',2,1, 6400,'Delinquent 90+'),
    ('Entity #0509',2,1, 5800,'Collections'),
    ('Entity #0234',2,1, 5200,'Delinquent 60-90'),
    ('Entity #0388',3,1, 4700,'Collections'),
    ('Entity #0093',2,1, 4200,'Delinquent 90+'),
    ('Entity #0601',2,1, 3800,'Delinquent 60-90'),
    ('Entity #0147',2,1, 3400,'Delinquent 60-90'),
    ('Entity #0455',2,1, 3100,'Delinquent 60-90'),
    ('Entity #0278',2,1, 2800,'Delinquent 60-90'),
    ('Entity #0512',2,1, 2500,'Delinquent 30-60'),
    ('Entity #0339',2,1, 2200,'Delinquent 30-60'),
    ('Entity #0066',2,1, 1900,'Delinquent 60-90'),
    ('Entity #0413',2,1, 1600,'Delinquent 30-60'),
    ('Entity #0188',2,1, 1300,'Delinquent 30-60'),
    ('Entity #0726',2,1,  980,'Delinquent 30-60'),
]

rng = random.Random(seed('collections'))
risk_records = [
    {'entity_id': f'ENT-{int(r[0].split("#")[1]):06d}',
     'display_id':r[0],'communities_active':r[1],'communities_flagged':r[2],
     'total_balance_due':r[3],'highest_delinquency':r[4]}
    for r in TOP25
]
# Generate remaining 293 records
statuses = ['Delinquent 30-60','Delinquent 60-90','Delinquent 90+','Collections']
for i in range(293):
    eid = 1000 + i
    bal = rng.randint(200, 900)
    risk_records.append({
        'entity_id':   f'ENT-{eid:06d}',
        'display_id':  f'Entity #{eid:04d}',
        'communities_active':   2,
        'communities_flagged':  1,
        'total_balance_due':    bal,
        'highest_delinquency':  rng.choice(statuses),
    })
write('collections_risk.json', risk_records)

print('Done. Total exposure: $' + f"{sum(r['total_balance_due'] for r in risk_records):,}")
