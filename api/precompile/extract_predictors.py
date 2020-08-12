import pickle

from snapanalysis.preprocessing.pulldown_metadata import OUTPUT_FILE as META_FILE
import pandas as pd
import os

OUTPUT_DIR = '/precompiled/'
PULLDOWN_ID_SET_OUTFILE = os.path.join(OUTPUT_DIR, 'pulldown_id_set.pickle')

def main():

    pdset = sorted(pd.read_hdf(META_FILE, '/meta/predictors_web')['Pull-Down ID'].unique())

    with open(PULLDOWN_ID_SET_OUTFILE, 'wb') as f:
        pickle.dump(pdset, f, pickle.HIGHEST_PROTOCOL)

if __name__ == '__main__':
    main()
