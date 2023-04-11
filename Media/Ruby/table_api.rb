require './table'

module TableAPI
  # emptyTable :: t:Table
  def self.empty_table
    t = Table.new

    raise "[Failed Ensure] schema(t) != [] | #{schema(t)} != []" unless schema(t) == []
    raise "[Failed Ensure] row(t) != 0 | #{nrows(t)} != 0" unless nrows(t) == 0

    t
  end

  def self.schema(table)
    table.schema
  end

  def self.nrows(table)
    table.rows.size
  end

  # addRows :: t1:Table * rs:Seq<Row> -> t2:Table
  def self.add_rows(t1, rs)
    t2 = t1.dup.tap do |t|
      t.rows += rs
    end

    # TODO: can we really call schema on both rows and tables?
    rs.each do |r|
      raise "[Failed Require] schema(r) is != schema(t1) | #{schema(r)} != #{schema(t1)}" unless schema(r) == schema(t1)
    end

    raise "[Failed Ensure] schema(t2) != schema(t1) | #{schema(t2)} != #{schema(t1)}" unless schema(t2) == schema(t1)
    raise "[Failed Ensure] nrows(t2) != nrows(t1) + length(rs) | #{nrows(t2)} != #{nrows(t1) + rs.size}" unless nrows(t2) == nrows(t1) + rs.size

    t2
  end
end
