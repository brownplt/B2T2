require './table'

module TableAPI
  # emptyTable :: t:Table
  def self.empty_table
    Table.new
  end

  def self.schema(table)
    table.schema
  end

  def self.nrows(table)
    table.rows.size
  end

  # addRows :: t1:Table * rs:Seq<Row> -> t2:Table
  def self.add_rows(old_table, sequence_of_rows)
    new_table = old_table.clone

    new_table.rows.concat(sequence_of_rows)

    new_table
  end
end
