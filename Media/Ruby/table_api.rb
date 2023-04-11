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

  def self.headers(table)
    table.schema == [] ? [] : table.schema.headers
  end

  # addRows :: t1:Table * rs:Seq<Row> -> t2:Table
  def self.add_rows(t1, rs)
    t2 = t1.dup.tap do |t|
      t.rows += rs
    end

    # ASSUMPTION: we can call schema on both rows and tables
    rs.each do |r|
      raise "[Failed Require] schema(r) is != schema(t1) | #{schema(r)} != #{schema(t1)}" unless schema(r) == schema(t1)
    end

    raise "[Failed Ensure] schema(t2) != schema(t1) | #{schema(t2)} != #{schema(t1)}" unless schema(t2) == schema(t1)
    raise "[Failed Ensure] nrows(t2) != nrows(t1) + length(rs) | #{nrows(t2)} != #{nrows(t1) + rs.size}" unless nrows(t2) == nrows(t1) + rs.size

    t2
  end

  # addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table
  def self.add_column(t1, c, vs)
    raise "[Failed Require] c is in headers(t1) | #{headers(t1)}" if headers(t1).member?(c)
    raise "[Failed Require] length(vs) != nrows(t1) | #{vs.size} != #{nrows(t1)}" unless vs.size == nrows(t1)

    t2 = t1.duplicate.tap do |t|
      t.add_header(c)
      i = 0
      t.rows.map! do |r|
        r.add_header(c)
       
        r.add_value(vs[i])
        i += 1

        r
      end
    end

    raise "[Failed Ensure] header(t2) is equal to concat(header(t1), [c]) | #{headers(t2)} != #{headers(t1) + [c]}" unless headers(t2) == headers(t1) + [c]
    # TODO: fix schema such that this method here has meaning. For now, a schema is essentially a wrapper around headers. So, indexing this does not make
    #       a ton of sense. I am pretty sure I need to re-read definitions from the paper.
    # headers(t1).each do |c|
    #   raise "[Failed Ensure]" unless schema(t1)[c] == schema(t2)[c]
    # end
    # raise "[Failed Ensure]" unless schema(t2)[c].is_instance_of(vs[0].class)
    raise "[Failed Ensure] nrows(t2) != nrows(t1) | #{nrows(t2)} != #{nrows(t1)}" unless nrows(t2) == nrows(t1)

    t2
  end
end
