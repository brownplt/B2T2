# frozen_string_literal: true

require './basics'
require './ensure_exception'
require './require_exception'
require './type_extensions'

# Table: an immutable, two part data structure: a schema and a rectangular collection of cells
class Table
  include Basics

  # extracts the schema of a table
  attr_accessor :schema
  # extracts the rows of a table
  attr_accessor :rows

  #### Constructors ####
  def self.empty_table
    t = Table.new

    assert_ensure { t.schema == Schema.new }
    assert_ensure { t.nrows.zero? }

    t
  end

  def initialize(schema: Schema.new, rows: [])
    @rows = rows
    @schema = schema
  end
  ####################

  #### Properties ####
  # nrows :: t:Table -> n:Number
  def nrows
    length(rows)
  end

  # ncols :: t:Table -> n:Number
  def ncols
    length(schema.headers)
  end

  # header :: t:Table -> cs:Seq<ColName>
  def header
    schema.headers.map { |h| h[:column_name] }
  end
  ####################

  #### Access Subcomponents ####
  # getRow :: t:Table * n:Number -> r:Row
  def get_row(number)
    assert_type_number(number)
    raise ArgumentError, 'index must be positive' if number.negative?
    raise ArgumentError, 'index must be less than length of table rows' if number >= rows.size

    rows[number]
  end

  # getValue :: r:Row * c:ColName -> v:Value
  # rubocop:disable Metrics/AbcSize
  def get_value(row, column_name)
    assert_type_string(column_name)

    assert_require { header.member?(column_name) }

    values = row.cells.select { |c| c.column_name == column_name }
    assert_ensure { values.size == 1 }
    value = values[0].value

    headers = row.schema.headers.select { |h| h[:column_name] == column_name }
    assert_ensure { headers.size == 1 }
    header = headers[0]
    assert_ensure { value.is_a?(header[:sort]) }

    value
  end
  # rubocop:enable Metrics/AbcSize

  # getColumn :: t:Table * n:Number -> vs:Seq<Value>
  def get_column_by_index(index)
    assert_type_number(index)

    assert_require { range(header.size).member?(index) }

    rows.map do |r|
      value = r.cells[index].value

      column_sort = r.schema.headers[index][:sort]

      value.is_a?(column_sort)

      value
    end
  end

  # getColumn :: t:Table * c:ColName -> vs:Seq<Value>
  # rubocop:disable Metrics/AbcSize
  def get_column_by_name(column_name)
    assert_type_string(column_name)

    assert_require { header.member?(column_name) }

    rows.map do |r|
      value = get_value(r, column_name)

      headers = r.schema.headers.select { |h| h[:column_name] == column_name }
      assert_ensure { headers.size == 1 }
      column_sort = headers[0][:sort]

      value.is_a?(column_sort)

      value
    end
  end
  # rubocop:enable Metrics/AbcSize

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
