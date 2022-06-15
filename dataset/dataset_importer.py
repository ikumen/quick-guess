import dotenv
import os
import json
import sys

from backend.datastores import ( MongoDatastore,
    drawingDatabase, DrawingDatastore,
    placeDatabase, PlaceDatastore 
)

from pathlib import Path

dotenv_path = Path(__file__).parent.parent / '.env'
dotenv.load_dotenv(dotenv_path)


class DatasetImporter:
    def __init__(self, datadir_path: Path, db: MongoDatastore):
        if not datadir_path:
            raise ValueError('Missing datadir_path')
        if not db:
            raise ValueError('Missing db')
        self.datadir_path = datadir_path
        self.db = db

    def run(self, datafile_pattern):
        self.db.clear()
        for file_path in self.datadir_path.glob(datafile_pattern):
            self.process_data_file(file_path)
        self.db.apply_indexes()

    def process_data_file(self, file_path):
        pass


class PlaceDatasetImporter(DatasetImporter):
    def __init__(self, datadir_path: Path = None, db: PlaceDatastore = None):
        super().__init__(
            datadir_path=datadir_path or Path(__file__).parent / 'places',
            db=db or placeDatabase
        )
    
    def run(self):
        super().run(datafile_pattern="*.csv")

    def process_data_file(self, file_path: Path):
        print(f"processing place file: {file_path.name}")
        with open(file_path) as file:
            for line in file:
                line = line.replace('"', '')
                attrs = line.split(',')
                try:
                    self.db.save({
                        'name': attrs[1],
                        'lcname': attrs[1].lower(),
                        'type': file_path.stem})
                except Exception as e:
                    pass


class DrawingDataSetImporter(DatasetImporter):
    def __init__(self, datadir_path: Path = None, db: DrawingDatastore = None):
        super().__init__(
            datadir_path=datadir_path or Path(__file__).parent / 'drawings',
            db=db or drawingDatabase
        )
    
    def run(self):
        super().run(datafile_pattern="*.ndjson")

    def process_data_file(self, file_path: Path):
        print(f"processing drawing file: {file_path.name}")
        n = 1
        with open(file_path) as file:
            for line in file:
                data = json.loads(line)
                if not data['recognized']:
                    continue
                try:
                    self.db.save({
                        '_id': data['key_id'],
                        'word': data['word'],
                        'drawing': data['drawing'],
                        'n': n})
                    n += 1
                except Exception as e:
                    print(e)
                    pass # keep processing

                if n > 100:
                    break


def parse_argv():
  opts = {}
  for argv in sys.argv:
    parts = argv.split("=")
    opts[parts[0]] = parts[1] if len(parts) > 1 else None
  return opts


if __name__ == '__main__':
    opts = parse_argv()
    if '--places' in opts:
        PlaceDatasetImporter(db=placeDatabase).run()
    elif '--drawings' in opts:
        DrawingDataSetImporter(db=drawingDatabase).run()
    else:
        raise ValueError('Valid options are "--places" or "--drawings"')

