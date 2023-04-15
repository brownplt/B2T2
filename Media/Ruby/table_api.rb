require './ensure_exception'
require './require_exception'
require './table'

module TableAPI
  # emptyTable :: t:Table
  def self.empty_table
    t = Table.new

    assert_ensure { schema(t) == Schema.new }
    assert_ensure { nrows(t) == 0 }

    t
  end

  def self.schema(table)
    table.schema
  end

  def self.nrows(table)
    table.rows.size
  end

  def self.headers(table)
    table.schema == [] ? [] : table.schema.column_names
  end

  # addRows :: t1:Table * rs:Seq<Row> -> t2:Table
  def self.add_rows(t1, rs)
    t2 = t1.dup.tap do |t|
      t.rows += rs
    end

    # ASSUMPTION: we can call schema on both rows and tables
    rs.each do |r|
      # raise "[Failed Require] schema(r) is != schema(t1) | #{schema(r)} != #{schema(t1)}" unless schema(r) == schema(t1)
    end

    assert_ensure { schema(t2) == schema(t1) }
    assert_ensure { nrows(t2) == nrows(t1) + rs.size }

    t2
  end

  # addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table
  def self.add_column(t1, c, vs)
    # Rob's requirements
    assert_require { c[:column_name].instance_of?(String) }
    assert_require { c[:sort].instance_of?(String) }

    # B2T2 requirements
    assert_require { !headers(t1).member?(c[:column_name]) }
    assert_require { vs.size == nrows(t1) }

    t2 = t1.duplicate.tap do |t|
      t.add_header(c)
      i = 0
      t.rows.map! do |r|
        r.add_cell(vs[i])
        i += 1

        r
      end
    end

    assert_ensure { headers(t2) == headers(t1) + [c[:column_name]] }
    headers(t1).each do |c|
      assert_ensure { schema(t1).col(c) == schema(t2).col(c) }
    end
    assert_ensure { nrows(t2) == nrows(t1) }
    # TODO: fix after negation
    # assert_ensure { vs.any?{ |v| v.class.to_s == schema(t2).col(c[:column_name])[:sort] } }

    t2
  end

  # buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table
  def self.build_column(t1, c, &block)
    # Rob's requirements
    assert_require { c[:column_name].instance_of?(String) }
    assert_require { c[:sort].instance_of?(String) }

    # B2T2 requirements
    assert_require { !headers(t1).member?(c[:column_name]) }

    t2 = t1.duplicate.tap do |t|
      t.add_header(c)
      i = 0
      t.rows.map! do |r|
        r.add_cell(block.call(r))
        i += 1

        r
      end
    end
    
    # TODO: schema(r) is equal to schema(t1)
    assert_ensure { headers(t2) == headers(t1) + [c[:column_name]] }
    headers(t1).each do |c|
      assert_ensure { schema(t2).col(c) == schema(t1).col(c) }
    end
    # TODO: assert type of row values added to table
    # assert_ensure { vs.any?{ |v| v.class.to_s != schema(t2).col(c[:column_name])[:sort] } }
    assert_ensure { nrows(t2) == nrows(t1) }

    t2
  end

  # vcat :: t1:Table * t2:Table -> t3:Table
  def self.vcat(t1, t2)
    assert_require { schema(t1) == schema(t2) }

    t3 = t1.duplicate.tap do |t|
      t.rows += t2.rows
    end

    assert_ensure { schema(t1) == schema(t3) }
    assert_ensure { nrows(t3) == (nrows(t1) + nrows(t2)) }

    t3
  end

  # Especially hacky, but it works
  def self.assert_require(&block)
    file_name, line_number = block.source_location
    message = IO.readlines(file_name)[line_number - 1].split("assert_require {")[1].split("}\n")[0].strip
    raise RequireException.new "[Failed Require]: #{message}" unless block.call
  end

  # Especially hacky, but it works
  def self.assert_ensure(&block)
    file_name, line_number = block.source_location
    message = IO.readlines(file_name)[line_number - 1].split("assert_ensure {")[1].split("}\n")[0].strip
    raise EnsureException.new "[Failed Ensure]: #{message}" unless block.call
  end
end
