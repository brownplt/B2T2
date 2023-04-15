# frozen_string_literal: true

require './basics'
require './ensure_exception'
require './require_exception'

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
  ####################
end
