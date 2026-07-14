import fs from 'fs';
import path from 'path';

export class MockDocumentSnapshot {
  constructor(public id: string, private docData: any) {}
  get exists() { return !!this.docData; }
  data() { return this.docData; }
}

export class MockQuerySnapshot {
  constructor(public docs: MockDocumentSnapshot[]) {}
  get empty() { return this.docs.length === 0; }
}

export class MockDocumentReference {
  constructor(private collectionName: string, public id: string, private db: MockDbImpl) {}

  async get() {
    const data = this.db.getData(this.collectionName, this.id);
    return new MockDocumentSnapshot(this.id, data);
  }

  async set(data: any, options?: any) {
    this.db.setData(this.collectionName, this.id, data, options);
  }

  async update(data: any) {
    this.db.updateData(this.collectionName, this.id, data);
  }

  async delete() {
    this.db.deleteData(this.collectionName, this.id);
  }
}

export class MockQuery {
  constructor(
    private collectionName: string,
    private db: MockDbImpl,
    private filters: Array<{ field: string, op: string, value: any }> = [],
    private limitVal?: number
  ) {}

  where(field: string, op: string, value: any) {
    return new MockQuery(this.collectionName, this.db, [...this.filters, { field, op, value }], this.limitVal);
  }

  limit(n: number) {
    return new MockQuery(this.collectionName, this.db, this.filters, n);
  }

  async get() {
    let items = this.db.getCollection(this.collectionName);
    for (const filter of this.filters) {
      items = items.filter(item => {
        const itemVal = item[filter.field];
        if (filter.op === '==') return itemVal === filter.value;
        if (filter.op === '!=') return itemVal !== filter.value;
        return true;
      });
    }
    if (this.limitVal !== undefined) {
      items = items.slice(0, this.limitVal);
    }
    const docs = items.map(item => new MockDocumentSnapshot(item.id, item));
    return new MockQuerySnapshot(docs);
  }
}

export class MockCollectionReference {
  constructor(private collectionName: string, private db: MockDbImpl) {}

  doc(id?: string) {
    const finalId = id || Math.random().toString(36).substring(2, 15);
    return new MockDocumentReference(this.collectionName, finalId, this.db);
  }

  where(field: string, op: string, value: any) {
    return new MockQuery(this.collectionName, this.db, [{ field, op, value }]);
  }

  limit(n: number) {
    return new MockQuery(this.collectionName, this.db, [], n);
  }

  async get() {
    const items = this.db.getCollection(this.collectionName);
    const docs = items.map(item => new MockDocumentSnapshot(item.id, item));
    return new MockQuerySnapshot(docs);
  }

  async add(data: any) {
    const id = Math.random().toString(36).substring(2, 15);
    this.db.setData(this.collectionName, id, data);
    return new MockDocumentReference(this.collectionName, id, this.db);
  }

  count() {
    return {
      get: async () => {
        const items = this.db.getCollection(this.collectionName);
        return {
          data: () => ({ count: items.length })
        };
      }
    };
  }
}

export class MockBatch {
  private operations: Array<() => void> = [];

  delete(docRef: MockDocumentReference) {
    this.operations.push(() => docRef.delete());
  }

  async commit() {
    for (const op of this.operations) {
      op();
    }
  }
}

export class MockDbImpl {
  private dbPath: string;
  private data: Record<string, any[]> = { books: [], authors: [], languages: [], categories: [] };

  constructor() {
    this.dbPath = path.join(process.cwd(), 'mock-db.json');
    this.load();
  }

  private load() {
    if (fs.existsSync(this.dbPath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
        if (!this.data.languages) this.data.languages = [];
        if (!this.data.categories) this.data.categories = [];
      } catch (e) {
        console.error('Error loading mock db', e);
      }
    } else {
      this.data = {
        authors: [
          { id: 'author-1', name: 'Collen Mululu', slug: 'collen-mululu', bio: 'A prominent Zambian local-language writer focusing on Tonga oral traditions.', photoUrl: '' },
          { id: 'author-2', name: 'Gaston Kaji', slug: 'gaston-kaji', bio: 'Expert linguist and writer of Kiikaonde grammar references.', photoUrl: '' }
        ],
        books: [
          { id: 'book-1', title: 'Tonga Folktales', slug: 'tonga-folktales', authorId: 'author-1', authorName: 'Collen Mululu', language: 'Tonga/Chitonga', category: 'Folktales & Oral Tradition', status: 'published', featured: true, synopsis: 'A collection of traditional Tonga stories passed down through generations.', coverImageUrl: '' },
          { id: 'book-2', title: 'Kiikaonde Grammar Guide', slug: 'kiikaonde-grammar-guide', authorId: 'author-2', authorName: 'Gaston Kaji', language: 'Kiikaonde', category: 'Grammar & Language Reference', status: 'published', featured: true, synopsis: 'The complete reference manual for learning and writing in Kiikaonde.', coverImageUrl: '' }
        ],
        languages: [
          { id: 'lang-1', name: 'Kiikaonde' },
          { id: 'lang-2', name: 'Tonga/Chitonga' }
        ],
        categories: [
          { id: 'cat-1', name: 'Grammar & Language Reference' },
          { id: 'cat-2', name: 'Folktales & Oral Tradition' },
          { id: 'cat-3', name: 'Readers & Learning Series' },
          { id: 'cat-4', name: 'Cultural & Historical Nonfiction' },
          { id: 'cat-5', name: "Children's Illustrated" }
        ]
      };
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving mock db', e);
    }
  }

  getCollection(name: string) {
    return this.data[name] || [];
  }

  getData(collection: string, id: string) {
    const list = this.getCollection(collection);
    return list.find(item => item.id === id);
  }

  setData(collection: string, id: string, val: any, options?: any) {
    if (!this.data[collection]) this.data[collection] = [];
    const list = this.data[collection];
    const index = list.findIndex(item => item.id === id);
    const payload = { id, ...val };
    if (index >= 0) {
      if (options?.merge) {
        list[index] = { ...list[index], ...val };
      } else {
        list[index] = payload;
      }
    } else {
      list.push(payload);
    }
    this.save();
  }

  updateData(collection: string, id: string, val: any) {
    this.setData(collection, id, val, { merge: true });
  }

  deleteData(collection: string, id: string) {
    if (!this.data[collection]) return;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    this.save();
  }

  batch() {
    return new MockBatch();
  }

  collection(name: string) {
    return new MockCollectionReference(name, this);
  }
}

export class MockAdminAuth {
  async verifySessionCookie(cookie: string) {
    if (cookie === 'mock-session-cookie') {
      return { uid: 'mock-admin-uid', email: 'admin@taanga-taanga.com' };
    }
    throw new Error('Invalid mock session cookie');
  }

  async createSessionCookie(idToken: string, options: any) {
    if (idToken === 'mock-id-token') {
      return 'mock-session-cookie';
    }
    throw new Error('Invalid mock ID token');
  }

  async createUser(properties: any) {
    return { uid: 'mock-admin-uid', email: properties.email };
  }
}

export class MockStorageBucket {
  constructor(private name: string) {}

  file(path: string) {
    return {
      getSignedUrl: async () => ['mock-signed-url'],
      save: async () => {}
    };
  }

  async setCorsConfiguration(config: any) {
    // No-op locally
  }
}

export class MockAdminStorage {
  bucket(name: string) {
    return new MockStorageBucket(name);
  }
}
