# frozen_string_literal: true

require './lib/basics'
require './lib/ensure_exception'
require './lib/require_exception'
require './lib/type_extensions'

# rubocop:disable Metrics/ClassLength
# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/MethodLength
# Table: an immutable, two part data structure: a schema and a rectangular collection of cells
class Table
  include Basics

  # extracts the schema of a table
  attr_accessor :schema
  # extracts the rows of a table
  attr_accessor :rows

  def initialize(schema: Schema.new, rows: [])
    @rows = rows
    @schema = schema
  end

  #### Constructors ####
  def self.empty_table
    t = Table.new

    assert_ensure { t.schema == Schema.new }
    assert_ensure { t.nrows.zero? }

    t
  end

  # addRows :: t1:Table * rs:Seq<Row> -> t2:Table
  def self.add_rows(table, rows)
    assert_require { rows.all? { |r| r.schema == table.schema } }

    new_table = Table.new(schema: table.schema, rows: table.rows + rows)

    assert_ensure { new_table.schema == table.schema }
    assert_ensure { new_table.nrows == table.nrows + rows.size }

    new_table
  end

  # MODIFIED: we include the sort of the column as well as the column name
  # addColumn :: t1:Table * c:ColName * vs:Seq<Value> -> t2:Table
  def self.add_column(table, column, values)
    assert_require { table.schema.headers.none? { |h| h[:column_name] == column[:column_name] } }
    assert_require { values.size == table.nrows }

    new_schema = Schema.new(headers: table.schema.headers + [column])
    new_rows = table.rows.zip(values).map do |row, value|
      row.schema = new_schema
      row.cells << Cell.new(column[:column_name], value)
    end
    new_table = Table.new(schema: new_schema, rows: new_rows)

    assert_ensure { new_table.schema.headers == table.schema.headers + [column] }
    assert_ensure { table.schema.headers.all? { |c| table.schema[c] == new_table.schema[c] } }
    assert_ensure { values.all? { |v| v.is_a?(new_table.schema[column[:column_name]][:sort]) } }
    assert_ensure { new_table.nrows == table.nrows }

    new_table
  end

  # buildColumn :: t1:Table * c:ColName * f:(r:Row -> v:Value) -> t2:Table
  def self.build_column(table, column, &block)
    assert_require { table.schema.headers.none? { |h| h[:column_name] == column[:column_name] } }

    new_schema = Schema.new(headers: table.schema.headers + [column])
    new_rows = table.rows.map do |row|
      row.schema = new_schema
      row.cells << Cell.new(column[:column_name], block.call(row))

      row
    end
    new_table = Table.new(schema: new_schema, rows: new_rows)

    assert_ensure { new_table.schema.headers == table.schema.headers + [column] }
    assert_ensure { table.schema.headers.all? { |c| table.schema[c] == new_table.schema[c] } }
    new_table.rows.each do |r|
      # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
      # rubocop:disable Layout/LineLength
      assert_ensure { new_table.get_value(r, column[:column_name]).is_a?(new_table.schema[column[:column_name]][:sort]) }
      # rubocop:enable Layout/LineLength
    end
    assert_ensure { new_table.nrows == table.nrows }

    new_table
  end

  # vcat :: t1:Table * t2:Table -> t3:Table
  def self.vcat(table1, table2)
    assert_require { table1.schema == table2.schema }

    table3 = Table.new(schema: table1.schema, rows: table1.rows + table2.rows)

    assert_ensure { table1.schema == table3.schema }
    assert_ensure { table3.nrows == table1.nrows + table2.nrows }

    table3
  end

  # hcat :: t1:Table * t2:Table -> t3:Table
  def self.hcat(table1, table2)
    # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
    # rubocop:disable Layout/LineLength
    assert_require { (table1.schema.headers + table2.schema.headers).uniq == (table1.schema.headers + table2.schema.headers) }
    # rubocop:enable Layout/LineLength
    assert_require { table1.nrows == table2.nrows }

    table3 = Table.new(
      schema: Schema.new(headers: table1.schema.headers + table2.schema.headers),
      rows: table1.rows.zip(table2.rows).map do |r1, r2|
              Row.new(
                schema: table1.schema, cells: r1.cells + r2.cells
              )
            end
    )

    # TODO: this is a hacky way to check that the schema is correct
    assert_ensure { table3.schema.headers == table1.schema.headers + table2.schema.headers }
    assert_ensure { table3.nrows == table1.nrows }

    table3
  end

  # values :: rs:Seq<Row> -> t:Table
  # since the spec assumes a schema attached to a row, we get the schema for free and are not left
  # implying the schema from the rows themselves
  def self.values(rows)
    # length(rs) is positive
    assert_require { rows.size >= 0 }
    assert_require { rows.all? { |r| r.is_a?(Row) && r.schema == rows[0].schema } }

    table = if rows.size.positive?
              Table.new(schema: rows[0].schema, rows: rows)
            else
              empty_table
            end

    if rows.size.positive?
      assert_ensure { table.schema == rows[0].schema }
    else
      assert_ensure { table.schema == Schema.new }
    end

    assert_ensure { table.nrows == rows.size }

    table
  end

  # crossJoin :: t1:Table * t2:Table -> t3:Table
  def self.cross_join(table1, table2)
    # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
    # rubocop:disable Layout/LineLength
    assert_require { (table1.schema.headers + table2.schema.headers).uniq == (table1.schema.headers + table2.schema.headers) }
    # rubocop:enable Layout/LineLength

    table3 = Table.new(
      schema: Schema.new(headers: table1.schema.headers + table2.schema.headers),
      rows: table1.rows.flat_map do |r1|
              table2.rows.map do |r2|
                Row.new(
                  schema: table1.schema, cells: r1.cells + r2.cells
                )
              end
            end
    )

    # TODO: this is a hacky way to check that the schema is correct
    assert_ensure { table3.schema.headers == table1.schema.headers + table2.schema.headers }
    assert_ensure { table3.nrows == (table1.nrows * table2.nrows) }

    table3
  end

  def self.left_join
    raise NotImplementedError
  end
  ####################

  #### Properties ####
  # TODO: move this off the table, should take a table as input (technically according to the spec)
  # nrows :: t:Table -> n:Number
  def nrows
    length(rows)
  end

  # ncols :: t:Table -> n:Number
  def ncols
    length(schema.headers)
  end

  # header :: t:Table -> cs:Seq<ColName>
  # def header
  # schema.headers.map { |h| h[:column_name] }
  # end
  ####################

  #### Access Subcomponents ####
  # getRow :: t:Table * n:Number -> r:Row
  def get_row(number)
    assert_type_number(number)
    raise ArgumentError, 'index must be positive' if number.negative?
    raise ArgumentError, 'index must be less than length of table rows' if number >= rows.size

    rows[number]
  end

  # # getValue :: r:Row * c:ColName -> v:Value
  # def get_value(row, column_name)
  #   assert_type_string(column_name)

  #   assert_require { header.member?(column_name) }

  #   values = row.cells.select { |c| c.column_name == column_name }
  #   assert_ensure { values.size == 1 }
  #   value = values[0].value

  #   headers = row.schema.headers.select { |h| h[:column_name] == column_name }
  #   assert_ensure { headers.size == 1 }
  #   header = headers[0]
  #   assert_ensure { value.is_a?(header[:sort]) }

  #   value
  # end
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/AbcSize
  # getColumn :: t:Table * n:Number -> vs:Seq<Value>
  def get_column_by_index(index)
    assert_type_number(index)

    assert_require { range(schema.headers.size).member?(index) }

    rows.map do |r|
      value = r.cells[index].value

      column_sort = r.schema.headers[index][:sort]

      value.is_a?(column_sort)

      value
    end
  end
  # rubocop:enable Metrics/AbcSize

  # getColumn :: t:Table * c:ColName -> vs:Seq<Value>
  def get_column_by_name(column_name)
    assert_type_string(column_name)

    # assert_require { schema.headers.member?(column_name) }
    rows.map do |r|
      value = get_value(r, column_name)

      headers = r.schema.headers.select { |h| h[:column_name] == column_name }
      assert_ensure { headers.size == 1 }
      column_sort = headers[0][:sort]

      value.is_a?(column_sort)

      value
    end
  end
  ####################

  #### Subtable ####
  # tfilter :: t1:Table * f:(r:Row -> b:Boolean) -> t2:Table
  def self.tfilter(table1, &block)
    table2 = Table.new(
      schema: table1.schema,
      rows: table1.rows.select { |r| block.call(r) }
    )

    assert_ensure { table2.schema == table1.schema }
    assert_ensure { table2.rows.all? { |r| r.schema == table1.schema } }

    table2
  end

  # selectRows :: t1:Table * ns:Seq<Number> -> t2:Table
  # rubocop:disable Metrics/AbcSize
  def self.select_rows_by_indecies(table1, indices)
    # functionally the same as 'for all n in ns, n is in range(nrows(t1))'
    assert_require { indices.is_a?(Array) }
    assert_require { indices.all? { |i| i.is_a?(Integer) } }
    assert_require { indices.all? { |i| i >= 0 } }
    assert_require { indices.all? { |i| i < table1.nrows } }

    table2 = Table.new(
      schema: table1.schema,
      rows: indices.map { |i| table1.rows[i] }
    )

    assert_ensure { table2.schema == table1.schema }
    assert_ensure { table2.nrows == indices.size }

    table2
  end
  # rubocop:enable Metrics/AbcSize

  # selectRows :: t1:Table * bs:Seq<Boolean> -> t2:Table
  ####################

  #### Ordering ####
  ####################

  #### Aggregate ####
  ####################

  #### Missing Values ####
  ####################

  #### Data Cleaning ####
  ####################

  #### Utilities ####
  ####################

  #### Ensure/Require Helpers ####
  # Especially hacky, but it works
  def self.assert_require(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_require {')[1].split("}\n")[0].strip
    raise RequireException, "[Failed Require]: #{message}" unless block.call
  end

  # Especially hacky, but it works
  def self.assert_ensure(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_ensure {')[1].split("}\n")[0].strip
    raise EnsureException, "[Failed Ensure]: #{message}" unless block.call
  end

  # Especially hacky, but it works
  def assert_require(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_require {')[1].split("}\n")[0].strip
    raise RequireException, "[Failed Require]: #{message}" unless block.call
  end

  # Especially hacky, but it works
  def assert_ensure(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_ensure {')[1].split("}\n")[0].strip
    raise EnsureException, "[Failed Ensure]: #{message}" unless block.call
  end
  ####################
end
# rubocop:enable Metrics/ClassLength
# rubocop:enable Metrics/MethodLength
