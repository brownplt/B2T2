# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/type_extensions'

# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/CyclomaticComplexity
# rubocop:disable Metrics/MethodLength
# rubocop:disable Metrics/PerceivedComplexity

# in an ideal world, I think it would be useful to encode tables as they are presented in the repo:
module TableEncoder
  def self.encode(data)
    rows = data
           .split("\n")
           .zip((0..))
           .select { |line| line[0].strip.start_with?('#') && line[1] != 2 }
           .map { |line| line[0].strip[3..-2].gsub('#', '').split('|').map(&:strip) }
           .map { |values| values.map { |value| try_to_force_type(value) }.compact }

    headers = rows.shift

    has_rows = !rows.empty?
    first_row = rows[0] if has_rows

    schema = Schema.new(
      # Object is basically a catch all, IIRC in Ruby, everything is an Object
      headers: headers.zip(0..)
                       .map do |header|
                 { column_name: header[0],
                   sort: has_rows ? first_row[header[1]].class : Object }
               end
    )

    rows = rows.map do |row|
      Row.new(
        schema: schema,
        cells: row.zip(0..).map do |value|
          Cell.new(headers[value[1]], value[0])
        end
      )
    end

    Table.new(schema: schema, rows: rows)
  end

  def self.try_to_force_type(value)
    # clean
    value_cleaned = value.strip.downcase

    # nil
    return nil if value_cleaned.empty?

    # Boolean
    return value_cleaned == 'true' if %w[true false].include?(value_cleaned)

    # Float
    return value_cleaned.to_f if value_cleaned.match(/^\d+\.\d*$/)

    # Integer
    return value_cleaned.to_i if value_cleaned.match(/^\d+$/)

    # Default: String
    value_cleaned
  end
end
# rubocop:enable Metrics/AbcSize
# rubocop:enable Metrics/CyclomaticComplexity
# rubocop:enable Metrics/MethodLength
# rubocop:enable Metrics/PerceivedComplexity
