exports.up = pgm => {
  pgm.createTable(
    'vulnerabilities',
    {
      id: 'id',
      customer_id: { type: 'integer', notNull: true },
      text: { type: 'text', notNull: true },
      system_user: { type: 'varchar(100)', notNull: true },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp')
      }
    },
    {
      constraints: {
        foreignKeys: {
          columns: 'customer_id',
          references: 'customers(id)',
          onDelete: 'CASCADE',
          match: 'SIMPLE'
        }
      }
    }
  );
};
