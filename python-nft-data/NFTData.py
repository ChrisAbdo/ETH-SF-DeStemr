import json
import requests

API_KEY = 'ckey_d04783f7a7bb4b9099996a457ae'
base_url = 'https://api.covalenthq.com/v1'
blockchain_chain_id = "80001"
demo_address = "0x0acBA4C41EaD17828b524A289eeb959Ea88CA63e"


def getNFTdata(chain_id, address):
    endpoint = f'/{chain_id}/tokens/{address}/nft_metadata/{token_id}/?key={API_KEY}'
    url = base_url + endpoint
    result = requests.get(url).json()

    data = result["data"]["items"][0]["nft_data"]

    print(json.dumps(data, indent=4, sort_keys=True))

    return (data)


def getTokenCount(chain_id, address):
    endpoint = f'/{chain_id}/tokens/{address}/nft_token_ids/?key={API_KEY}'
    url = base_url + endpoint
    result = requests.get(url).json()
    data = result["data"]

    token_count = len(data["items"])
    print("\033[92m" + f"NFT Stem Count: {token_count}" + "\033[0m")
    return (token_count)


for token_id in range(0, getTokenCount(blockchain_chain_id, demo_address) + 1):
    getNFTdata(blockchain_chain_id, demo_address)
