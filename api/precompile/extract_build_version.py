import pickle

VERSION_FILE = '/build/info.txt'
OUTPUT_FILE = '/precompiled/snapanalysis_build.pickle'

def main():

    with open(VERSION_FILE, 'r') as f:
        version_info = f.read()

    date, commit, __ = version_info.split('\n')

    date = date.partition('=')[-1]
    commit = commit.partition('=')[-1]

    version = {
        'date': date,
        'commit': commit,
    }

    with open(OUTPUT_FILE, 'wb') as f:
        pickle.dump(version, f, protocol=pickle.HIGHEST_PROTOCOL)


if __name__ == '__main__':
    main()