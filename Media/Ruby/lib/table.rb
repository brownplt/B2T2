# frozen_string_literal: true

require './lib/basics'
require './lib/ensure_exception'
require './lib/require_exception'
require './lib/type_extensions'

# rubocop:disable Metrics/ClassLength
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/CyclomaticComplexity
# rubocop:disable Metrics/PerceivedComplexity
# rubocop:disable Metrics/AbcSize
# rubocop:disable Style/MultilineBlockChain

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
    assert_require { number >= 0 }
    assert_require { number < nrows }

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
      rows: table1.rows.select do |r|
        result = block.call(r)

        # hacky way to check that the block returns a boolean. In Ruby, the truthiness doesn't care if it
        # is a boolean or not, so we need to check that it is a boolean (out of choice for
        # spec/example_errors/favorite_color_spec.rb to pass)
        assert_require { result.is_a?(Boolean) }

        result
      end
    )

    assert_ensure { table2.schema == table1.schema }
    assert_ensure { table2.rows.all? { |r| r.schema == table1.schema } }

    table2
  end

  # selectRows :: t1:Table * ns:Seq<Number> -> t2:Table
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

  # selectRows :: t1:Table * bs:Seq<Boolean> -> t2:Table
  def self.select_rows_by_predicate(table1, predicates)
    # bonus type checking
    assert_require { predicates.is_a?(Array) }
    assert_require { predicates.all? { |p| p.is_a?(Boolean) } }
    # spec defined check(s)
    assert_require { predicates.size == table1.nrows }

    table2 = Table.new(
      schema: table1.schema,
      rows: table1.rows.select.with_index { |_, i| predicates[i] }
    )

    assert_ensure { table2.schema == table1.schema }
    assert_ensure { table2.nrows == remove_all(predicates, [false]).size }

    table2
  end

  # head :: t1:Table * n:Number -> t2:Table
  def self.head(table1, num)
    assert_require { num.is_a?(Integer) }

    if num >= 0
      assert_require { (0..table1.nrows).include?(num) }
    else
      assert_require { (0..table1.nrows).include?(-num) }
    end

    table2 = Table.new(
      schema: table1.schema,
      rows: table1.rows.zip(1..).select do |val|
              (num >= 0 && val[1] <= num) || (num.negative? && val[1] <= (table1.nrows + num))
            end.map { |val| val[0] }
    )

    assert_ensure { table1.schema == table2.schema }
    if num >= 0
      assert_ensure { table2.nrows == num }
    else
      assert_ensure { table2.nrows == (table1.nrows + num) }
    end

    table2
  end
  ####################

  #### Ordering ####
  # tsort :: t1:Table * c:ColName * b:Boolean -> t2:Table
  def self.tsort(table1, column_name, is_ascending)
    assert_require { column_name.is_a?(String) }
    assert_require { is_ascending.is_a?(Boolean) }

    # TODO: we do this alot, write a method for it
    assert_require { table1.schema.headers.select { |h| h[:column_name] == column_name }.any? }
    # spec requires the sort to be Number
    column_sort =  table1.schema.headers.select { |h| h[:column_name] == column_name }[0][:sort]
    assert_require { column_sort == Integer || column_name == Float }

    sorted_rows = table1.rows.sort_by { |r| get_value(r, column_name) }
    sorted_rows = sorted_rows.reverse unless is_ascending

    table2 = Table.new(
      schema: table1.schema,
      rows: sorted_rows
    )

    assert_ensure { table2.nrows == table1.nrows }
    assert_ensure { table2.schema == table1.schema }

    table2
  end
  ####################

  #### Aggregate ####
  # count :: t1:Table * c:ColName -> t2:Table

  def self.count(table1, column_name)
    assert_require { column_name.is_a?(String) }
    assert_require { table1.schema.headers.map { |x| x[:column_name] }.member?(column_name) }
    # TODO: assert that schema(t1)[c] is a categorical sort

    sort_of_column = table1.schema.headers.select { |h| h[:column_name] == column_name }[0][:sort]

    new_schema = Schema.new(
      headers: [
        { column_name: 'value', sort: sort_of_column },
        { column_name: 'count', sort: Integer }
      ]
    )

    reduced_rows = table1
                   .rows
                   .map { |r| r.cells.select { |x| x.column_name == column_name } }
                   .flatten
                   .map(&:value)
                   .each_with_object({}) do |x, sum|
      sum[x] = 0 unless sum.key?(x)
      sum[x] += 1
    end

    table2 = Table.new(
      schema: new_schema,
      rows: reduced_rows.map do |k, v|
        Row.new(
          schema: new_schema,
          cells: [
            Cell.new('value', k),
            Cell.new('count', v)
          ]
        )
      end
    )

    assert_ensure { table2.schema.headers.size == 2 }
    assert_ensure { table2.schema.headers[0][:column_name] == 'value' }
    assert_ensure { table2.schema.headers[1][:column_name] == 'count' }
    assert_ensure { table2.schema.headers[0][:sort] == sort_of_column }
    assert_ensure { table2.schema.headers[1][:sort] == Integer }
    # TODO: length(removeDuplicates(getColumn(t1, c)))

    table2
  end

  # distinct :: t1:Table -> t2:Table
  def self.distinct(table1)
    table2 = Table.new(
      schema: table1.schema,
      # how pleasant!
      rows: table1.rows.uniq
    )

    assert_ensure { table1.schema == table2.schema }

    table2
  end

  # dropColumn :: t1:Table * c:ColName -> t2:Table
  def self.drop_column(table1, column_name)
    assert_require { column_name.is_a?(String) }
    assert_require { table1.schema.headers.select { |h| h[:column_name] == column_name }.any? }

    table2 = Table.new(
      schema: Schema.new(headers: table1.schema.headers.reject { |h| h[:column_name] == column_name }),
      rows: table1.rows.map do |r|
              r.cells = r.cells.reject { |c| c.column_name == column_name }
              r
            end
    )

    assert_ensure { table1.nrows == table2.nrows }
    # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
    # rubocop:disable Layout/LineLength
    assert_ensure { table2.schema.headers.map { |h| h[:column_name] } == remove_all(table1.schema.headers.map { |h| h[:column_name] }, [column_name]) }
    # rubocop:disenableable Layout/LineLength
    assert_ensure { table2.schema.headers.map { |h| table1.schema.headers.include?(h) }.all? }

    table2
  end

  # dropColumns :: t1:Table * cs:Seq<ColName> -> t2:Table
  def self.drop_columns(table1, column_names)
    assert_require { column_names.is_a?(Array) }
    # TODO: write this so sane humans can comprehend
    # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
    assert_require { column_names.map { |c| c.is_a?(String) && table1.schema.headers.select { |h| h[:column_name] == c }.any? }.all? }
    # rubocop:enable Layout/LineLength

    table2 = Table.new(
      schema: Schema.new(headers: table1.schema.headers.reject { |h| column_names.include?(h[:column_name]) }),
      rows: table1.rows.map do |r|
              r.cells = r.cells.reject { |c| column_names.include?(c.column_name) }
              r
            end
    )

    assert_ensure { table1.nrows == table2.nrows }
    # disabling rubocop to enable my hacky assert_ensure error message parsing to continue working
    # rubocop:disable Layout/LineLength
    assert_ensure { table2.schema.headers.map { |h| h[:column_name] } == remove_all(table1.schema.headers.map { |h| h[:column_name] }, column_names) }
    # rubocop:enable Layout/LineLength
    assert_ensure { table2.schema.headers.map { |h| table1.schema.headers.include?(h) }.all? }

    table2
  end

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

  #### Class/Instance Duplicates ####
  # Duplicated due to issue between class and instance methods
  def self.remove_all(sequence_a, sequence_b)
    assert_type_sequence(sequence_a)
    assert_type_sequence(sequence_b)

    values_in_b = sequence_b.each_with_object({}) do |x, memoize|
      memoize[x] = true
    end

    sequence_a.reject { |x| values_in_b.key?(x) }
  end

  def self.assert_type_sequence(sequence)
    raise ArgumentError, 'expected a sequence' unless sequence.is_a?(Array)
  end

  # getValue :: r:Row * c:ColName -> v:Value
  def self.get_value(row, column_name)
    assert_type_string(column_name)

    assert_require { header(row).map { |c| c[:column_name] }.member?(column_name) }

    values = row.cells.select { |c| c.column_name == column_name }
    assert_ensure { values.size == 1 }
    value = values[0].value

    headers = row.schema.headers.select { |h| h[:column_name] == column_name }
    assert_ensure { headers.size == 1 }
    headerr = headers[0]
    assert_ensure { value.is_a?(headerr[:sort]) }

    value
  end

  def self.assert_type_string(string)
    raise ArgumentError, 'expected a string' unless string.is_a?(String)
  end

  def self.header(value)
    raise ArgumentError, 'expected a row or a table' unless value.respond_to?(:schema)

    value.schema.headers
  end
  ####################
end
# rubocop:enable Metrics/ClassLength
# rubocop:enable Metrics/MethodLength
# rubocop:enable Metrics/CyclomaticComplexity
# rubocop:enable Metrics/PerceivedComplexity
# rubocop:enable Metrics/AbcSize
# rubocop:enable Style/MultilineBlockChain
